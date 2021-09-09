const path = require('path');

// Available Web Services
const ElectronicBilling = require('./Class/ElectronicBilling');
const RegisterScopeFour = require('./Class/RegisterScopeFour');
const RegisterScopeFive = require('./Class/RegisterScopeFive');
const RegisterScopeTen = require('./Class/RegisterScopeTen');
const RegisterScopeThirteen = require('./Class/RegisterScopeThirteen');
const Authorization = require('./Class/Authorization');

/**
 * Software Development Kit for AFIP web services
 * 
 * This release of Afip SDK is intended to facilitate 
 * the integration to other different web services that 
 * Electronic Billing   
 * 
 * @link http://www.afip.gob.ar/ws/ AFIP Web Services documentation
 * 
 * @author 	Afip SDK afipsdk@gmail.com
 * @package Afip
 * @version 0.6
 **/
module.exports = Afip;

function Afip(options = {}){
	/**
	 * File name for the WSDL corresponding to WSAA
	 *
	 * @var string
	 **/
	this.WSAA_WSDL;

	/**
	 * The url to get WSAA token
	 *
	 * @var string
	 **/
	this.WSAA_URL;

	/**
	 * File name for the X.509 certificate in PEM format
	 *
	 * @var string
	 **/
	this.CERT;

	/**
	 * File name for the private key correspoding to CERT (PEM)
	 *
	 * @var string
	 **/
	this.PRIVATEKEY;

	/**
	 * The CUIT to use
	 *
	 * @var int
	 **/
	this.CUIT;

	// Create an Afip instance if it is not
	if (!(this instanceof Afip)) {return new Afip(options)}


	if (!options.hasOwnProperty('CUIT')) {throw new Error("CUIT field is required in options array");}
	
	// Define default options
	if (!options.hasOwnProperty('production')) {options['production'] = false;}
	if (!options.hasOwnProperty('cert')) {options['cert'] = 'cert';}
	if (!options.hasOwnProperty('key')) {options['key'] = 'key';}
	
	if (options['production'] !== true) {options['production'] = false;}

	this.options = options;

	this.CUIT 		= options['CUIT'];
	this.CERT 		= options['cert'];
	this.PRIVATEKEY = options['key'];
	this.WSAA_WSDL 	= path.resolve(__dirname, 'Afip_res/', 'wsaa.wsdl');

	if (options['production']) {
		this.WSAA_URL = 'https://wsaa.afip.gov.ar/ws/services/LoginCms';
	}
	else {
		this.WSAA_URL = 'https://wsaahomo.afip.gov.ar/ws/services/LoginCms';
	}

	this.ElectronicBilling 			= new ElectronicBilling(this);
	this.RegisterScopeFour 			= new RegisterScopeFour(this);
	this.RegisterScopeFive 			= new RegisterScopeFive(this);
	this.RegisterInscriptionProof 	= new RegisterScopeFive(this);
	this.RegisterScopeTen 			= new RegisterScopeTen(this);
	this.RegisterScopeThirteen 		= new RegisterScopeThirteen(this);
	this.Authorization 		        = new Authorization(this);
}

