// define the class in a closure and do not overfill the global namespace
(function(){
    // add some modules that are required to implement this module
    // e.g. Module.require(name, version);

    // define a new classname by setting their namespace and an optional version
    // e.g. ClassName = Module.createNS("namespace", version);
    Parser = Module.createNS("org.iswas.utils.Parser", 0.1);
    // define the symbols that can be imported by other modules
    // e.g. ClassName.EXPORTED_SYMBOLS = ["@symbols"];
    Parser.EXPORTED_SYMBOLS = ["getValueForPattern"];
    // define your symbols in a closure to get real privacy :-)
    // and do not forget to register the @public/@static symbols for the class!
    (function(){
        // REGISTER THE @public/@static SYMBOLS FOR THE CLASS
        // e.g. ClassName.method = method;
        Parser.getValueForPattern = getValueForPattern;
        
        // DEFINE THE @public/@static SYMBOLS FOR THE CLOSURE
        /**
         * Parse a line with the given pattern and get the value up to the related
         * escape character.
         *
         * @param text - to parse
         * @param pattern - that match a key in the line
         * @param esc - describes the first character that don't belong to the value
         * @param index - to start searching
         * @return <ul>
         *         <li>-1 pattern not found</li>
         *         <li>value up to the related escape character if found</li>
         *         <li>empty string if pattern found and index out of bound</li>
         *         </ul>
         */
        function getValueForPattern(text, pattern, esc, index) {
            // set index on pattern begin
            if ((index = text.indexOf(pattern, index)) == -1) {
                // pattern not found return -1
                return null;
            } else {
                // found a pattern -> get value
                var value = "";
                // set index on value begin
                index += pattern.length;
                try {
                    // get the value for this pattern
                    var nextChar = text.charAt(index);
                    // value not complete
                    while (nextChar != esc) {
                        // expand value with next character
                        value += nextChar;
                        // get next character in this line
                        nextChar = text.charAt(++index);
                    }
                } catch (e) {
                    throw new Error("org.iswas.utils.Parser.getValueForPattern[Index out of bound]");
                }
                return value;
            }
        }
        
        // DEFINE THE @private SYMBOLS FOR THE CLOSURE
        // note it is quite good to set an underscore before each symbol
    })();
})();
