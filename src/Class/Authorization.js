const AfipWebService = require('./AfipWebService');

const soap = require('soap');
const forge = require('node-forge');
const xml2js = require('xml2js');

// XML parser
var xmlParser = new xml2js.Parser({
	normalizeTags: true,
	normalize: true,
	explicitArray: false,
	attrkey: 'header',
	tagNameProcessors: [key => key.replace('soapenv:', '')]
});

/**
 * SDK for AFIP Authorization (wsaa)
 * 
 **/
module.exports = class Authorization extends AfipWebService {
	constructor(afip){
		const options = {
			soapV12: false,
			WSDL: '',
			URL: '',
			WSDL_TEST: '',
			URL_TEST: '',
			afip
		}

		super(options);
	}

	/**
	 * Create an TA from WSAA
	 *
	 * Request to WSAA for a tokent authorization for service 
	 * and save this in a json file
	 *
	 * @param service Service for token authorization
	 **/
	async getTokenAuth(service) {
		const date = new Date();
	
		// Tokent request authorization XML
		const tra = (`<?xml version="1.0" encoding="UTF-8" ?>
		<loginTicketRequest version="1.0">
			<header>
				<uniqueId>${Math.floor(date.getTime() / 1000)}</uniqueId>
				<generationTime>${new Date(date.getTime() - 600000).toISOString()}</generationTime>
				<expirationTime>${new Date(date.getTime() + 600000).toISOString()}</expirationTime>
			</header>
			<service>${service}</service>
		</loginTicketRequest>`).trim();

		// Get cert from parameters
		const certPromise = this.afip.CERT
			
		// Get key from parameters
		const keyPromise = this.afip.PRIVATEKEY

		// Wait for cert and key content
		const [cert, key] = await Promise.all([certPromise, keyPromise]);

		// Sign Tokent request authorization XML
		const p7 = forge.pkcs7.createSignedData();
		p7.content = forge.util.createBuffer(tra, "utf8");
		p7.addCertificate(cert);
		p7.addSigner({
			authenticatedAttributes: [{
				type: forge.pki.oids.contentType,
				value: forge.pki.oids.data,
			}, 
			{
				type: forge.pki.oids.messageDigest
			}, 
			{
				type: forge.pki.oids.signingTime, 
				value: new Date()
			}],
			certificate: cert,
			digestAlgorithm: forge.pki.oids.sha256,
			key: key,
		});
		p7.sign();
		const bytes = forge.asn1.toDer(p7.toAsn1()).getBytes();
		const signedTRA = Buffer.from(bytes, "binary").toString("base64");

		// SOAP Client options
		const soapClientOptions = { disableCache:true, endpoint: this.afip.WSAA_URL };

		// Create SOAP client
		const soapClient = await soap.createClientAsync(this.afip.WSAA_WSDL, soapClientOptions);

		// Arguments for soap client request 
		const loginArguments = { in0: signedTRA };
		
		// Call loginCms SOAP method
		const [ loginCmsResult ] = await soapClient.loginCmsAsync(loginArguments)

		// Parse loginCmsReturn to JSON 
		const res = await xmlParser.parseStringPromise(loginCmsResult.loginCmsReturn); 

		return JSON.stringify(res.loginticketresponse)
	}
}

