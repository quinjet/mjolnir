function define(name, value) {
    Object.defineProperty(
        exports, 
        name,
        {
            value: value,
            enumerable: true
        }
    );
}
define("EMAIL", "email");
define("SMS", "SMS");
define("VERIFICATION_CODE_LENGTH", 4);
define("VALID_NOTIFICATION_TYPES", [this.EMAIL,this.SMS]);
define("SMS_CONFIG", "/etc/sokrati/db/unicel.cfg");
define("ACTIVATION_TEXT", 
       "Sokrati registration code is __ACTIVATION_CODE__." + 
       " Get more leads and plan better, today.");
define("UNMAPPED_ACCOUNT_VERTICAL_ID", 54);
define("UNMAPPED_ACCOUNT_SUBVERTICAL_ID", 437);
define("UNMAPPED_VERTICAL", "Unmapped Accounts");
define("UNMAPPED_SUBVERTICAL", "Unmapped Accounts");
define("ASIA_CALCUTTA_TIMEZONE_ID",8);
define("INR", "INR");
define("DOORS_AGENCY_DOMAIN_URL_ID", 5);
define("LEADMANAGER_AGENCY_DOMAIN_URL_ID", 29);
define("DEFAULT_BUDGET", 0);
define("SIGNUP_LAUNCH_TYPE", "LEADMANAGER_SIGNUP");
define("SUCCESS_FEED_STATUS_TYPE", "SUCCESS");
define("PEKKA_CONFIG","/etc/sokrati/config/wallService/pekkaSvcConfig.cfg")
define("DOORS_USER_ID", 291);
define("DOORS_AGENCY_ID", 19);
define("LEADMANAGER_AGENCY_ID", 46);
define("CONFIGDB_SVC_CONFIG", "/etc/sokrati/config/wallService/configDbSvcConfig.cfg")
define("ACTIVATION_CDOE_EXPIRY_TIME", 60);
define("IN","IN");
define("DOMAIN_URL", "http://www.dummydomain.com/");
define("HADES_CONFIG", "/etc/sokrati/config/wallService/hadesConfig.cfg");
define("GRANT","GRANT");
define("READ","READ");
define("MASTER_USER", this.DOORS_USER_ID);
define("APP_NAME", "wallService")