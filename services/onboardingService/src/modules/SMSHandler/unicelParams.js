define = 
    function(name, value) {
        Object.defineProperty(
            exports, 
            name,
            {
                value: value,
                enumerable: true
            }
        );
    };
define("VENDOR_NAME", "UNICEL");
define("UNICEL_URL", "www.unicel.in");
define("UNICEL_USERNAME", "uname");
define("UNICEL_PASSWORD", "pass");
define("UNICEL_SENDER_ID", "send");
define("UNICEL_RECEIVER_PARAM", "dest");
define("UNICEL_MSG_PARAM", "msg");
define("UNICEL_IS_LONG_MESSAGE", "concat");
define("UNICEL_IS_INTERNATIONAL", "Intl");
define("UNICEL_SEND_MESSAGE_ENDPOINT","/SendSMS/sendmsg.php");
define("MAX_LENGTH", 160);
define("ERROR_CODES",["0x200"]);
