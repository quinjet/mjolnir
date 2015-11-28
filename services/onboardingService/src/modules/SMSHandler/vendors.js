var define = 
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
define("UNICEL", "UNICEL");
define("SUPPORTED_VENDORS", [this.UNICEL]);