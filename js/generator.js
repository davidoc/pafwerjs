/**
 * Created by ocalladw on 2017-01-10.
 */
;(function(exports){
    // var TOTAL_EVENTS = 500
    //   , events_left = TOTAL_EVENTS;
    //
    //     if ( random.ready() )
    //       events_left = 0;

        function parseOptions(options) {
          return $.extend({
              use_dirty: false
            , use_number: false
            , use_symbol: false
            , use_spaces: true
            }, options);
          };

        exports.sentencePassword = function(template, options) {
          var entropy = 0
            , sentence = []
            , haystack
            , token
            , i;

          options = parseOptions(options);

          for ( i = 0; i < template.length; i++ ) {
            token = template[i];
            haystack = words[token];

            if ( ! haystack ) {
                if (options.use_more_templates) {
                    sentence.push(token);
                    continue;
                } else {
                    throw new Error('Unknown token "' + token + '"');
                }
            }

            if ( options.use_dirty )
              haystack = haystack.concat(words["dirty_" + token]);

            sentence.push(random.choice(haystack));
            entropy += Math.log(haystack.length)/Math.log(2);
          }

          if ( options.use_dirty )
          {
            // choose a random word to replace with a dirty word
            // note: not all parts of speech have dirty equivalents
            do
            {
              i = random.random(template.length);
              token = template[i];
              haystack = words["dirty_" + token];
            } while ( ! haystack
                      || haystack.length == 0 )

            sentence[i] = random.choice(haystack);

            entropy += Math.log(template.length)/Math.log(2);
            entropy -= Math.log(words[token].length)/Math.log(2);
          }

          if (!options.use_spaces) // Capitalize the letters if we don't use spaces
          {
            for ( i = 0; i < sentence.length; i++ ) {
              token = sentence[i];
              token = token.substr(0, 1).toUpperCase() + token.substr(1);
              sentence[i] = token;
            }
          }

          var ret = {
            password: sentence.join(" ")
          , entropy: entropy
          };
          if ( options.use_number )
          {
            var new_password = exports.addReplacement({
              'a': '4',
              'e': '3',
              'i': '1',
              'o': '0',
              'q': '9',
              's': '5',
              't': '7',
              'z': '2'
              }, ret.password);
            ret.password = new_password.password;
            ret.entropy += new_password.entropy;
          }
          if ( options.use_symbol )
          {
            var new_password = exports.addReplacement({
              'a': '@',
              'b': '|3',
              'c': '(',
              'h': '|-|',
              'i': '!',
              'k': '|<',
              'l': '|',
              't': '+',
              'v': '\\/',
              's': '$',
              'x': '%'
              }, ret.password);
            ret.password = new_password.password;
            ret.entropy += new_password.entropy;
          }
          if ( ! options.use_spaces )
          {
            ret.password = ret.password.replace(/ /g, '');
          }
          return ret;
        };

        exports.addReplacement = function(replacements, string) {
          var chars = string.split('')
            , i
            , replaceable = new RegExp('[' + Object.keys(replacements) + ']', 'g');

          do {
            i = random.random(chars.length);
          } while ( ! chars[i].match(replaceable) )

          chars[i] = replacements[chars[i]];
          return {
            password: chars.join('')
          , entropy: Math.log(string.match(replaceable).length)/Math.log(2)
          };
        };

        exports.templateEntropy = function(template, options) {
          var entropy = 0
            , haystack;

          options = parseOptions(options);

          for ( var i = 0; i < template.length; i++ ) {
            haystack = words[template[i]];
            if ( options.use_dirty )
              haystack = haystack.concat(words["dirty_" + template[i]]);
            entropy += Math.log(haystack.length)/Math.log(2);
          }

          return entropy;
        };

        exports.choose_template = function(options) {
            var template = ['adjective', 'noun', 'verb', 'adjective', 'noun'];

            options = parseOptions(options);

            if (options.use_more_templates) {
                template = random.choice([
                    ['adjective', 'noun', 'verb', 'adjective', 'noun'],
                    ['adjective', 'adjective', 'noun', 'verb', 'article', 'noun'],
                    // Inspired by Pafwert:
                    ['verb', 'article', 'adjective', 'noun', "@", 'adjective', 'noun', ".", "com"],
                    ['article', "very", 'adjective', 'adjective', 'noun', 'verb', 'noun']
                ])
            }

            if ( options.use_more_words )
                template = ['article', 'adjective', 'noun', 'verb', 'article', 'adjective', 'noun'];

            if ( options.diceware ) {
                template = ['diceware', 'diceware', 'diceware', 'diceware', 'diceware'];
                if ( options.use_more_words )
                    template = template.concat(['diceware', 'diceware']);
            }

            return template
        }
})(window);
