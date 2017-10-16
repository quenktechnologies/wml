// provide a local version for test purposes:
/**
 * See also:
 * http://stackoverflow.com/questions/1382107/whats-a-good-way-to-extend-error-in-javascript/#35881508
 * but we keep the prototype.constructor and prototype.name assignment lines too for compatibility
 * with userland code which might access the derived class in a 'classic' way.
 *
 * @public
 * @constructor
 * @nocollapse
 */
function JisonLexerError(msg, hash) {
    Object.defineProperty(this, 'name', {
        enumerable: false,
        writable: false,
        value: 'JisonLexerError'
    });

    if (msg == null) msg = '???';

    Object.defineProperty(this, 'message', {
        enumerable: false,
        writable: true,
        value: msg
    });

    this.hash = hash;

    var stacktrace;
    if (hash && hash.exception instanceof Error) {
        var ex2 = hash.exception;
        this.message = ex2.message || msg;
        stacktrace = ex2.stack;
    }
    if (!stacktrace) {
        if (Error.hasOwnProperty('captureStackTrace')) { // V8
            Error.captureStackTrace(this, this.constructor);
        } else {
            stacktrace = (new Error(msg)).stack;
        }
    }
    if (stacktrace) {
        Object.defineProperty(this, 'stack', {
            enumerable: false,
            writable: false,
            value: stacktrace
        });
    }
}

if (typeof Object.setPrototypeOf === 'function') {
    Object.setPrototypeOf(JisonLexerError.prototype, Error.prototype);
} else {
    JisonLexerError.prototype = Object.create(Error.prototype);
}
JisonLexerError.prototype.constructor = JisonLexerError;
JisonLexerError.prototype.name = 'JisonLexerError';


var __hacky_counter__ = 0;

/**
 * @constructor
 * @nocollapse
 */
function XRegExp(re, f) {
    this.re = re;
    this.flags = f;
    this._getUnicodeProperty = function (k) {};
    var fake = /./;    // WARNING: this exact 'fake' is also depended upon by the xregexp unit test!
    __hacky_counter__++;
    fake.__hacky_backy__ = __hacky_counter__;
    return fake;
}



var lexer = {
/*JISON-LEX-ANALYTICS-REPORT*/EOF: 1,
    ERROR: 2,

    // JisonLexerError: JisonLexerError,        /// <-- injected by the code generator

    // options: {},                             /// <-- injected by the code generator

    // yy: ...,                                 /// <-- injected by setInput()

    __currentRuleSet__: null,                   /// INTERNAL USE ONLY: internal rule set cache for the current lexer state

    __error_infos: [],                          /// INTERNAL USE ONLY: the set of lexErrorInfo objects created since the last cleanup

    __decompressed: false,                      /// INTERNAL USE ONLY: mark whether the lexer instance has been 'unfolded' completely and is now ready for use

    done: false,                                /// INTERNAL USE ONLY
    _backtrack: false,                          /// INTERNAL USE ONLY
    _input: '',                                 /// INTERNAL USE ONLY
    _more: false,                               /// INTERNAL USE ONLY
    _signaled_error_token: false,               /// INTERNAL USE ONLY

    conditionStack: [],                         /// INTERNAL USE ONLY; managed via `pushState()`, `popState()`, `topState()` and `stateStackSize()`

    match: '',                                  /// READ-ONLY EXTERNAL ACCESS - ADVANCED USE ONLY: tracks input which has been matched so far for the lexer token under construction. `match` is identical to `yytext` except that this one still contains the matched input string after `lexer.performAction()` has been invoked, where userland code MAY have changed/replaced the `yytext` value entirely!
    matched: '',                                /// READ-ONLY EXTERNAL ACCESS - ADVANCED USE ONLY: tracks entire input which has been matched so far
    matches: false,                             /// READ-ONLY EXTERNAL ACCESS - ADVANCED USE ONLY: tracks RE match result for last (successful) match attempt
    yytext: '',                                 /// ADVANCED USE ONLY: tracks input which has been matched so far for the lexer token under construction; this value is transferred to the parser as the 'token value' when the parser consumes the lexer token produced through a call to the `lex()` API.
    offset: 0,                                  /// READ-ONLY EXTERNAL ACCESS - ADVANCED USE ONLY: tracks the 'cursor position' in the input string, i.e. the number of characters matched so far
    yyleng: 0,                                  /// READ-ONLY EXTERNAL ACCESS - ADVANCED USE ONLY: length of matched input for the token under construction (`yytext`)
    yylineno: 0,                                /// READ-ONLY EXTERNAL ACCESS - ADVANCED USE ONLY: 'line number' at which the token under construction is located
    yylloc: null,                               /// READ-ONLY EXTERNAL ACCESS - ADVANCED USE ONLY: tracks location info (lines + columns) for the token under construction

    /**
     * INTERNAL USE: construct a suitable error info hash object instance for `parseError`.
     * 
     * @public
     * @this {RegExpLexer}
     */
    constructLexErrorInfo: function lexer_constructLexErrorInfo(msg, recoverable) {
        /** @constructor */
        var pei = {
            errStr: msg,
            recoverable: !!recoverable,
            text: this.match,           // This one MAY be empty; userland code should use the `upcomingInput` API to obtain more text which follows the 'lexer cursor position'...
            token: null,
            line: this.yylineno,
            loc: this.yylloc,
            yy: this.yy,
            lexer: this,

            /**
             * and make sure the error info doesn't stay due to potential
             * ref cycle via userland code manipulations.
             * These would otherwise all be memory leak opportunities!
             * 
             * Note that only array and object references are nuked as those
             * constitute the set of elements which can produce a cyclic ref.
             * The rest of the members is kept intact as they are harmless.
             * 
             * @public
             * @this {LexErrorInfo}
             */
            destroy: function destructLexErrorInfo() {
                // remove cyclic references added to error info:
                // info.yy = null;
                // info.lexer = null;
                // ...
                var rec = !!this.recoverable;
                for (var key in this) {
                    if (this.hasOwnProperty(key) && typeof key === 'object') {
                        this[key] = undefined;
                    }
                }
                this.recoverable = rec;
            }
        };
        // track this instance so we can `destroy()` it once we deem it superfluous and ready for garbage collection!
        this.__error_infos.push(pei);
        return pei;
    },

    /**
     * handler which is invoked when a lexer error occurs.
     * 
     * @public
     * @this {RegExpLexer}
     */
    parseError: function lexer_parseError(str, hash, ExceptionClass) {
        if (!ExceptionClass) {
            ExceptionClass = this.JisonLexerError;
        }
        if (this.yy) {
            if (this.yy.parser && typeof this.yy.parser.parseError === 'function') {
                return this.yy.parser.parseError.call(this, str, hash, ExceptionClass) || this.ERROR;
            } else if (typeof this.yy.parseError === 'function') {
                return this.yy.parseError.call(this, str, hash, ExceptionClass) || this.ERROR;
            } 
        }
        throw new ExceptionClass(str, hash);
    },

    /**
     * method which implements `yyerror(str, ...args)` functionality for use inside lexer actions.
     * 
     * @public
     * @this {RegExpLexer}
     */
    yyerror: function yyError(str /*, ...args */) {
        var lineno_msg = '';
        if (this.options.trackPosition) {
            lineno_msg = ' on line ' + (this.yylineno + 1);
        }
        var p = this.constructLexErrorInfo('Lexical error' + lineno_msg + ': ' + str, this.options.lexerErrorsAreRecoverable);

        // Add any extra args to the hash under the name `extra_error_attributes`:
        var args = Array.prototype.slice.call(arguments, 1);
        if (args.length) {
            p.extra_error_attributes = args;
        }

        return (this.parseError(p.errStr, p, this.JisonLexerError) || this.ERROR);
    },

    /**
     * final cleanup function for when we have completed lexing the input;
     * make it an API so that external code can use this one once userland
     * code has decided it's time to destroy any lingering lexer error
     * hash object instances and the like: this function helps to clean
     * up these constructs, which *may* carry cyclic references which would
     * otherwise prevent the instances from being properly and timely
     * garbage-collected, i.e. this function helps prevent memory leaks!
     * 
     * @public
     * @this {RegExpLexer}
     */
    cleanupAfterLex: function lexer_cleanupAfterLex(do_not_nuke_errorinfos) {
        // prevent lingering circular references from causing memory leaks:
        this.setInput('', {});

        // nuke the error hash info instances created during this run.
        // Userland code must COPY any data/references
        // in the error hash instance(s) it is more permanently interested in.
        if (!do_not_nuke_errorinfos) {
            for (var i = this.__error_infos.length - 1; i >= 0; i--) {
                var el = this.__error_infos[i];
                if (el && typeof el.destroy === 'function') {
                    el.destroy();
                }
            }
            this.__error_infos.length = 0;
        }

        return this;
    },

    /**
     * clear the lexer token context; intended for internal use only
     * 
     * @public
     * @this {RegExpLexer}
     */
    clear: function lexer_clear() {
        this.yytext = '';
        this.yyleng = 0;
        this.match = '';
        // - DO NOT reset `this.matched`
        this.matches = false;
        this._more = false;
        this._backtrack = false;

        var col = this.yylloc ? this.yylloc.last_column : 0;
        this.yylloc = {
            first_line: this.yylineno + 1,
            first_column: col,
            last_line: this.yylineno + 1,
            last_column: col,

            range: [this.offset, this.offset]
        };
    },

    /**
     * resets the lexer, sets new input
     * 
     * @public
     * @this {RegExpLexer}
     */
    setInput: function lexer_setInput(input, yy) {
        this.yy = yy || this.yy || {};

        // also check if we've fully initialized the lexer instance,
        // including expansion work to be done to go from a loaded
        // lexer to a usable lexer:
        if (!this.__decompressed) {
          // step 1: decompress the regex list:
          var rules = this.rules;
          for (var i = 0, len = rules.length; i < len; i++) {
            var rule_re = rules[i];

            // compression: is the RE an xref to another RE slot in the rules[] table?
            if (typeof rule_re === 'number') {
              rules[i] = rules[rule_re];
            }
          }

          // step 2: unfold the conditions[] set to make these ready for use:
          var conditions = this.conditions;
          for (var k in conditions) {
            var spec = conditions[k];

            var rule_ids = spec.rules;

            var len = rule_ids.length;
            var rule_regexes = new Array(len + 1);            // slot 0 is unused; we use a 1-based index approach here to keep the hottest code in `lexer_next()` fast and simple!
            var rule_new_ids = new Array(len + 1);

            for (var i = 0; i < len; i++) {
              var idx = rule_ids[i];
              var rule_re = rules[idx];
              rule_regexes[i + 1] = rule_re;
              rule_new_ids[i + 1] = idx;
            }

            spec.rules = rule_new_ids;
            spec.__rule_regexes = rule_regexes;
            spec.__rule_count = len;
          }

          this.__decompressed = true;
        }

        this._input = input || '';
        this.clear();
        this._signaled_error_token = false;
        this.done = false;
        this.yylineno = 0;
        this.matched = '';
        this.conditionStack = ['INITIAL'];
        this.__currentRuleSet__ = null;
        this.yylloc = {
            first_line: 1,
            first_column: 0,
            last_line: 1,
            last_column: 0,

            range: [0, 0]
        };
        this.offset = 0;
        return this;
    },

    /**
     * edit the remaining input via user-specified callback.
     * This can be used to forward-adjust the input-to-parse, 
     * e.g. inserting macro expansions and alike in the
     * input which has yet to be lexed.
     * The behaviour of this API contrasts the `unput()` et al
     * APIs as those act on the *consumed* input, while this
     * one allows one to manipulate the future, without impacting
     * the current `yyloc` cursor location or any history. 
     * 
     * Use this API to help implement C-preprocessor-like
     * `#include` statements, etc.
     * 
     * The provided callback must be synchronous and is
     * expected to return the edited input (string).
     *
     * The `cpsArg` argument value is passed to the callback
     * as-is.
     *
     * `callback` interface: 
     * `function callback(input, cpsArg)`
     * 
     * - `input` will carry the remaining-input-to-lex string
     *   from the lexer.
     * - `cpsArg` is `cpsArg` passed into this API.
     * 
     * The `this` reference for the callback will be set to
     * reference this lexer instance so that userland code
     * in the callback can easily and quickly access any lexer
     * API. 
     *
     * When the callback returns a non-string-type falsey value,
     * we assume the callback did not edit the input and we
     * will using the input as-is.
     *
     * When the callback returns a non-string-type value, it
     * is converted to a string for lexing via the `"" + retval`
     * operation. (See also why: http://2ality.com/2012/03/converting-to-string.html 
     * -- that way any returned object's `toValue()` and `toString()`
     * methods will be invoked in a proper/desirable order.)
     * 
     * @public
     * @this {RegExpLexer}
     */
    editRemainingInput: function lexer_editRemainingInput(callback, cpsArg) {
        var rv = callback.call(this, this._input, cpsArg);
        if (typeof rv !== 'string') {
            if (rv) {
                this._input = '' + rv; 
            }
            // else: keep `this._input` as is. 
        } else {
            this._input = rv; 
        }
        return this;
    },

    /**
     * consumes and returns one char from the input
     * 
     * @public
     * @this {RegExpLexer}
     */
    input: function lexer_input() {
        if (!this._input) {
            //this.done = true;    -- don't set `done` as we want the lex()/next() API to be able to produce one custom EOF token match after this anyhow. (lexer can match special <<EOF>> tokens and perform user action code for a <<EOF>> match, but only does so *once*)
            return null;
        }
        var ch = this._input[0];
        this.yytext += ch;
        this.yyleng++;
        this.offset++;
        this.match += ch;
        this.matched += ch;
        // Count the linenumber up when we hit the LF (or a stand-alone CR).
        // On CRLF, the linenumber is incremented when you fetch the CR or the CRLF combo
        // and we advance immediately past the LF as well, returning both together as if
        // it was all a single 'character' only.
        var slice_len = 1;
        var lines = false;
        if (ch === '\n') {
            lines = true;
        } else if (ch === '\r') {
            lines = true;
            var ch2 = this._input[1];
            if (ch2 === '\n') {
                slice_len++;
                ch += ch2;
                this.yytext += ch2;
                this.yyleng++;
                this.offset++;
                this.match += ch2;
                this.matched += ch2;
                this.yylloc.range[1]++;
            }
        }
        if (lines) {
            this.yylineno++;
            this.yylloc.last_line++;
            this.yylloc.last_column = 0;
        } else {
            this.yylloc.last_column++;
        }
        this.yylloc.range[1]++;

        this._input = this._input.slice(slice_len);
        return ch;
    },

    /**
     * unshifts one char (or an entire string) into the input
     * 
     * @public
     * @this {RegExpLexer}
     */
    unput: function lexer_unput(ch) {
        var len = ch.length;
        var lines = ch.split(/(?:\r\n?|\n)/g);

        this._input = ch + this._input;
        this.yytext = this.yytext.substr(0, this.yytext.length - len);
        this.yyleng = this.yytext.length;
        this.offset -= len;
        this.match = this.match.substr(0, this.match.length - len);
        this.matched = this.matched.substr(0, this.matched.length - len);

        if (lines.length > 1) {
            this.yylineno -= lines.length - 1;

            this.yylloc.last_line = this.yylineno + 1;
            var pre = this.match;
            var pre_lines = pre.split(/(?:\r\n?|\n)/g);
            if (pre_lines.length === 1) {
                pre = this.matched;
                pre_lines = pre.split(/(?:\r\n?|\n)/g);
            }
            this.yylloc.last_column = pre_lines[pre_lines.length - 1].length;
        } else {
            this.yylloc.last_column -= len;
        }

        this.yylloc.range[1] = this.yylloc.range[0] + this.yyleng;

        this.done = false;
        return this;
    },

    /**
     * cache matched text and append it on next action
     * 
     * @public
     * @this {RegExpLexer}
     */
    more: function lexer_more() {
        this._more = true;
        return this;
    },

    /**
     * signal the lexer that this rule fails to match the input, so the
     * next matching rule (regex) should be tested instead.
     * 
     * @public
     * @this {RegExpLexer}
     */
    reject: function lexer_reject() {
        if (this.options.backtrack_lexer) {
            this._backtrack = true;
        } else {
            // when the `parseError()` call returns, we MUST ensure that the error is registered.
            // We accomplish this by signaling an 'error' token to be produced for the current
            // `.lex()` run.
            var lineno_msg = '';
            if (this.options.trackPosition) {
                lineno_msg = ' on line ' + (this.yylineno + 1);
            }
            var pos_str = '';
            if (typeof this.showPosition === 'function') {
                pos_str = this.showPosition();
                if (pos_str && pos_str[0] !== '\n') {
                    pos_str = '\n' + pos_str;
                }
            }
            var p = this.constructLexErrorInfo('Lexical error' + lineno_msg + ': You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).' + pos_str, false);
            this._signaled_error_token = (this.parseError(p.errStr, p, this.JisonLexerError) || this.ERROR);
        }
        return this;
    },

    /**
     * retain first n characters of the match
     * 
     * @public
     * @this {RegExpLexer}
     */
    less: function lexer_less(n) {
        return this.unput(this.match.slice(n));
    },

    /**
     * return (part of the) already matched input, i.e. for error
     * messages.
     * 
     * Limit the returned string length to `maxSize` (default: 20).
     * 
     * Limit the returned string to the `maxLines` number of lines of
     * input (default: 1).
     * 
     * Negative limit values equal *unlimited*.
     * 
     * @public
     * @this {RegExpLexer}
     */
    pastInput: function lexer_pastInput(maxSize, maxLines) {
        var past = this.matched.substring(0, this.matched.length - this.match.length);
        if (maxSize < 0)
            maxSize = past.length;
        else if (!maxSize)
            maxSize = 20;
        if (maxLines < 0)
            maxLines = past.length;         // can't ever have more input lines than this!
        else if (!maxLines)
            maxLines = 1;
        // `substr` anticipation: treat \r\n as a single character and take a little
        // more than necessary so that we can still properly check against maxSize
        // after we've transformed and limited the newLines in here:
        past = past.substr(-maxSize * 2 - 2);
        // now that we have a significantly reduced string to process, transform the newlines
        // and chop them, then limit them:
        var a = past.replace(/\r\n|\r/g, '\n').split('\n');
        a = a.slice(-maxLines);
        past = a.join('\n');
        // When, after limiting to maxLines, we still have too much to return,
        // do add an ellipsis prefix...
        if (past.length > maxSize) {
            past = '...' + past.substr(-maxSize);
        }
        return past;
    },

    /**
     * return (part of the) upcoming input, i.e. for error messages.
     * 
     * Limit the returned string length to `maxSize` (default: 20).
     * 
     * Limit the returned string to the `maxLines` number of lines of input (default: 1).
     * 
     * Negative limit values equal *unlimited*.
     *
     * > ### NOTE ###
     * >
     * > *"upcoming input"* is defined as the whole of the both
     * > the *currently lexed* input, together with any remaining input
     * > following that. *"currently lexed"* input is the input 
     * > already recognized by the lexer but not yet returned with
     * > the lexer token. This happens when you are invoking this API
     * > from inside any lexer rule action code block. 
     * >
     * 
     * @public
     * @this {RegExpLexer}
     */
    upcomingInput: function lexer_upcomingInput(maxSize, maxLines) {
        var next = this.match;
        if (maxSize < 0)
            maxSize = next.length + this._input.length;
        else if (!maxSize)
            maxSize = 20;
        if (maxLines < 0)
            maxLines = maxSize;         // can't ever have more input lines than this!
        else if (!maxLines)
            maxLines = 1;
        // `substring` anticipation: treat \r\n as a single character and take a little
        // more than necessary so that we can still properly check against maxSize
        // after we've transformed and limited the newLines in here:
        if (next.length < maxSize * 2 + 2) {
            next += this._input.substring(0, maxSize * 2 + 2);  // substring is faster on Chrome/V8
        }
        // now that we have a significantly reduced string to process, transform the newlines
        // and chop them, then limit them:
        var a = next.replace(/\r\n|\r/g, '\n').split('\n');
        a = a.slice(0, maxLines);
        next = a.join('\n');
        // When, after limiting to maxLines, we still have too much to return,
        // do add an ellipsis postfix...
        if (next.length > maxSize) {
            next = next.substring(0, maxSize) + '...';
        }
        return next;
    },

    /**
     * return a string which displays the character position where the
     * lexing error occurred, i.e. for error messages
     * 
     * @public
     * @this {RegExpLexer}
     */
    showPosition: function lexer_showPosition(maxPrefix, maxPostfix) {
        var pre = this.pastInput(maxPrefix).replace(/\s/g, ' ');
        var c = new Array(pre.length + 1).join('-');
        return pre + this.upcomingInput(maxPostfix).replace(/\s/g, ' ') + '\n' + c + '^';
    },

    /**
     * return a string which displays the lines & columns of input which are referenced 
     * by the given location info range, plus a few lines of context.
     * 
     * This function pretty-prints the indicated section of the input, with line numbers 
     * and everything!
     * 
     * This function is very useful to provide highly readable error reports, while
     * the location range may be specified in various flexible ways:
     * 
     * - `loc` is the location info object which references the area which should be
     *   displayed and 'marked up': these lines & columns of text are marked up by `^`
     *   characters below each character in the entire input range.
     * 
     * - `context_loc` is the *optional* location info object which instructs this
     *   pretty-printer how much *leading* context should be displayed alongside
     *   the area referenced by `loc`. This can help provide context for the displayed
     *   error, etc.
     * 
     *   When this location info is not provided, a default context of 3 lines is
     *   used.
     * 
     * - `context_loc2` is another *optional* location info object, which serves
     *   a similar purpose to `context_loc`: it specifies the amount of *trailing*
     *   context lines to display in the pretty-print output.
     * 
     *   When this location info is not provided, a default context of 1 line only is
     *   used.
     * 
     * Special Notes:
     * 
     * - when the `loc`-indicated range is very large (about 5 lines or more), then
     *   only the first and last few lines of this block are printed while a
     *   `...continued...` message will be printed between them.
     * 
     *   This serves the purpose of not printing a huge amount of text when the `loc`
     *   range happens to be huge: this way a manageable & readable output results
     *   for arbitrary large ranges.
     * 
     * - this function can display lines of input which whave not yet been lexed.
     *   `prettyPrintRange()` can access the entire input!
     * 
     * @public
     * @this {RegExpLexer}
     */
    prettyPrintRange: function lexer_prettyPrintRange(loc, context_loc, context_loc2) {
        var error_size = loc.last_line - loc.first_line;
        const CONTEXT = 3;
        const CONTEXT_TAIL = 1;
        const MINIMUM_VISIBLE_NONEMPTY_LINE_COUNT = 2;
        var input = this.matched + this._input;
        var lines = input.split('\n');
        //var show_context = (error_size < 5 || context_loc);
        var l0 = Math.max(1, (context_loc ? context_loc.first_line : loc.first_line - CONTEXT));
        var l1 = Math.max(1, (context_loc2 ? context_loc2.last_line : loc.last_line + CONTEXT_TAIL));
        var lineno_display_width = (1 + Math.log10(l1 | 1) | 0);
        var ws_prefix = new Array(lineno_display_width).join(' ');
        var nonempty_line_indexes = [];
        var rv = lines.slice(l0 - 1, l1 + 1).map(function injectLineNumber(line, index) {
            var lno = index + l0;
            var lno_pfx = (ws_prefix + lno).substr(-lineno_display_width);
            var rv = lno_pfx + ': ' + line;
            var errpfx = (new Array(lineno_display_width + 1)).join('^');
            if (lno === loc.first_line) {
                var offset = loc.first_column + 2;
                var len = Math.max(2, (lno === loc.last_line ? loc.last_column : line.length) - loc.first_column + 1);
                var lead = (new Array(offset)).join('.');
                var mark = (new Array(len)).join('^');
                rv += '\n' + errpfx + lead + mark;
                if (line.trim().length > 0) {
                    nonempty_line_indexes.push(index);
                }
            } else if (lno === loc.last_line) {
                var offset = 2 + 1;
                var len = Math.max(2, loc.last_column + 1);
                var lead = (new Array(offset)).join('.');
                var mark = (new Array(len)).join('^');
                rv += '\n' + errpfx + lead + mark;
                if (line.trim().length > 0) {
                    nonempty_line_indexes.push(index);
                }
            } else if (lno > loc.first_line && lno < loc.last_line) {
                var offset = 2 + 1;
                var len = Math.max(2, line.length + 1);
                var lead = (new Array(offset)).join('.');
                var mark = (new Array(len)).join('^');
                rv += '\n' + errpfx + lead + mark;
                if (line.trim().length > 0) {
                    nonempty_line_indexes.push(index);
                }
            }
            rv = rv.replace(/\t/g, ' ');
            return rv;
        });
        // now make sure we don't print an overly large amount of error area: limit it 
        // to the top and bottom line count:
        if (nonempty_line_indexes.length > 2 * MINIMUM_VISIBLE_NONEMPTY_LINE_COUNT) {
            var clip_start = nonempty_line_indexes[MINIMUM_VISIBLE_NONEMPTY_LINE_COUNT - 1] + 1;
            var clip_end = nonempty_line_indexes[nonempty_line_indexes.length - MINIMUM_VISIBLE_NONEMPTY_LINE_COUNT] - 1;
            console.log("clip off: ", {
                start: clip_start, 
                end: clip_end,
                len: clip_end - clip_start + 1,
                arr: nonempty_line_indexes,
                rv
            });
            var intermediate_line = (new Array(lineno_display_width + 1)).join(' ') +     '  (...continued...)';
            intermediate_line += '\n' + (new Array(lineno_display_width + 1)).join('-') + '  (---------------)';
            rv.splice(clip_start, clip_end - clip_start + 1, intermediate_line);
        }
        return rv.join('\n');
    },

    /**
     * helper function, used to produce a human readable description as a string, given
     * the input `yylloc` location object.
     * 
     * Set `display_range_too` to TRUE to include the string character index position(s)
     * in the description if the `yylloc.range` is available.
     * 
     * @public
     * @this {RegExpLexer}
     */
    describeYYLLOC: function lexer_describe_yylloc(yylloc, display_range_too) {
        var l1 = yylloc.first_line;
        var l2 = yylloc.last_line;
        var c1 = yylloc.first_column;
        var c2 = yylloc.last_column;
        var dl = l2 - l1;
        var dc = c2 - c1;
        var rv;
        if (dl === 0) {
            rv = 'line ' + l1 + ', ';
            if (dc <= 1) {
                rv += 'column ' + c1;
            } else {
                rv += 'columns ' + c1 + ' .. ' + c2;
            }
        } else {
            rv = 'lines ' + l1 + '(column ' + c1 + ') .. ' + l2 + '(column ' + c2 + ')';
        }
        if (yylloc.range && display_range_too) {
            var r1 = yylloc.range[0];
            var r2 = yylloc.range[1] - 1;
            if (r2 <= r1) {
                rv += ' {String Offset: ' + r1 + '}';
            } else {
                rv += ' {String Offset range: ' + r1 + ' .. ' + r2 + '}';
            }
        }
        return rv;
    },

    /**
     * test the lexed token: return FALSE when not a match, otherwise return token.
     * 
     * `match` is supposed to be an array coming out of a regex match, i.e. `match[0]`
     * contains the actually matched text string.
     * 
     * Also move the input cursor forward and update the match collectors:
     * 
     * - `yytext`
     * - `yyleng`
     * - `match`
     * - `matches`
     * - `yylloc`
     * - `offset`
     * 
     * @public
     * @this {RegExpLexer}
     */
    test_match: function lexer_test_match(match, indexed_rule) {
        var token,
            lines,
            backup,
            match_str,
            match_str_len;

        if (this.options.backtrack_lexer) {
            // save context
            backup = {
                yylineno: this.yylineno,
                yylloc: {
                    first_line: this.yylloc.first_line,
                    last_line: this.yylloc.last_line,
                    first_column: this.yylloc.first_column,
                    last_column: this.yylloc.last_column,

                    range: this.yylloc.range.slice(0)
                },
                yytext: this.yytext,
                match: this.match,
                matches: this.matches,
                matched: this.matched,
                yyleng: this.yyleng,
                offset: this.offset,
                _more: this._more,
                _input: this._input,
                //_signaled_error_token: this._signaled_error_token,
                yy: this.yy,
                conditionStack: this.conditionStack.slice(0),
                done: this.done
            };
        }

        match_str = match[0];
        match_str_len = match_str.length;
        // if (match_str.indexOf('\n') !== -1 || match_str.indexOf('\r') !== -1) {
            lines = match_str.split(/(?:\r\n?|\n)/g);
            if (lines.length > 1) {
                this.yylineno += lines.length - 1;

                this.yylloc.last_line = this.yylineno + 1;
                this.yylloc.last_column = lines[lines.length - 1].length;
            } else {
                this.yylloc.last_column += match_str_len;
            }
        // }
        this.yytext += match_str;
        this.match += match_str;
        this.matched += match_str;
        this.matches = match;
        this.yyleng = this.yytext.length;
        this.yylloc.range[1] += match_str_len;

        // previous lex rules MAY have invoked the `more()` API rather than producing a token:
        // those rules will already have moved this `offset` forward matching their match lengths,
        // hence we must only add our own match length now:
        this.offset += match_str_len;
        this._more = false;
        this._backtrack = false;
        this._input = this._input.slice(match_str_len);

        // calling this method:
        //
        //   function lexer__performAction(yy, yyrulenumber, YY_START) {...}
        token = this.performAction.call(this, this.yy, indexed_rule, this.conditionStack[this.conditionStack.length - 1] /* = YY_START */);
        // otherwise, when the action codes are all simple return token statements:
        //token = this.simpleCaseActionClusters[indexed_rule];

        if (this.done && this._input) {
            this.done = false;
        }
        if (token) {
            return token;
        } else if (this._backtrack) {
            // recover context
            for (var k in backup) {
                this[k] = backup[k];
            }
            this.__currentRuleSet__ = null;
            return false; // rule action called reject() implying the next rule should be tested instead.
        } else if (this._signaled_error_token) {
            // produce one 'error' token as `.parseError()` in `reject()`
            // did not guarantee a failure signal by throwing an exception!
            token = this._signaled_error_token;
            this._signaled_error_token = false;
            return token;
        }
        return false;
    },

    /**
     * return next match in input
     * 
     * @public
     * @this {RegExpLexer}
     */
    next: function lexer_next() {
        if (this.done) {
            this.clear();
            return this.EOF;
        }
        if (!this._input) {
            this.done = true;
        }

        var token,
            match,
            tempMatch,
            index;
        if (!this._more) {
            this.clear();
        }
        var spec = this.__currentRuleSet__;
        if (!spec) {
            // Update the ruleset cache as we apparently encountered a state change or just started lexing.
            // The cache is set up for fast lookup -- we assume a lexer will switch states much less often than it will
            // invoke the `lex()` token-producing API and related APIs, hence caching the set for direct access helps
            // speed up those activities a tiny bit.
            spec = this.__currentRuleSet__ = this._currentRules();
            // Check whether a *sane* condition has been pushed before: this makes the lexer robust against
            // user-programmer bugs such as https://github.com/zaach/jison-lex/issues/19
            if (!spec || !spec.rules) {
                var lineno_msg = '';
                if (this.options.trackPosition) {
                    lineno_msg = ' on line ' + (this.yylineno + 1);
                }
                var pos_str = '';
                if (typeof this.showPosition === 'function') {
                    pos_str = this.showPosition();
                    if (pos_str && pos_str[0] !== '\n') {
                        pos_str = '\n' + pos_str;
                    }
                }
                var p = this.constructLexErrorInfo('Internal lexer engine error' + lineno_msg + ': The lex grammar programmer pushed a non-existing condition name "' + this.topState() + '"; this is a fatal error and should be reported to the application programmer team!' + pos_str, false);
                // produce one 'error' token until this situation has been resolved, most probably by parse termination!
                return (this.parseError(p.errStr, p, this.JisonLexerError) || this.ERROR);
            }
        }

        var rule_ids = spec.rules;
        var regexes = spec.__rule_regexes;
        var len = spec.__rule_count;

        // Note: the arrays are 1-based, while `len` itself is a valid index,
        // hence the non-standard less-or-equal check in the next loop condition!
        for (var i = 1; i <= len; i++) {
            tempMatch = this._input.match(regexes[i]);
            if (tempMatch && (!match || tempMatch[0].length > match[0].length)) {
                match = tempMatch;
                index = i;
                if (this.options.backtrack_lexer) {
                    token = this.test_match(tempMatch, rule_ids[i]);
                    if (token !== false) {
                        return token;
                    } else if (this._backtrack) {
                        match = undefined;
                        continue; // rule action called reject() implying a rule MISmatch.
                    } else {
                        // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
                        return false;
                    }
                } else if (!this.options.flex) {
                    break;
                }
            }
        }
        if (match) {
            token = this.test_match(match, rule_ids[index]);
            if (token !== false) {
                return token;
            }
            // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
            return false;
        }
        if (!this._input) {
            this.done = true;
            this.clear();
            return this.EOF;
        } else {
            var lineno_msg = '';
            if (this.options.trackPosition) {
                lineno_msg = ' on line ' + (this.yylineno + 1);
            }
            var pos_str = '';
            if (typeof this.showPosition === 'function') {
                pos_str = this.showPosition();
                if (pos_str && pos_str[0] !== '\n') {
                    pos_str = '\n' + pos_str;
                }
            }
            var p = this.constructLexErrorInfo('Lexical error' + lineno_msg + ': Unrecognized text.' + pos_str, this.options.lexerErrorsAreRecoverable);
            token = (this.parseError(p.errStr, p, this.JisonLexerError) || this.ERROR);
            if (token === this.ERROR) {
                // we can try to recover from a lexer error that `parseError()` did not 'recover' for us
                // by moving forward at least one character at a time:
                if (!this.match.length) {
                    this.input();
                }
            }
            return token;
        }
    },

    /**
     * return next match that has a token
     * 
     * @public
     * @this {RegExpLexer}
     */
    lex: function lexer_lex() {
        var r;
        // allow the PRE/POST handlers set/modify the return token for maximum flexibility of the generated lexer:
        if (typeof this.options.pre_lex === 'function') {
            r = this.options.pre_lex.call(this);
        }

        while (!r) {
            r = this.next();
        }

        if (typeof this.options.post_lex === 'function') {
            // (also account for a userdef function which does not return any value: keep the token as is)
            r = this.options.post_lex.call(this, r) || r;
        }
        return r;
    },

    /**
     * backwards compatible alias for `pushState()`;
     * the latter is symmetrical with `popState()` and we advise to use
     * those APIs in any modern lexer code, rather than `begin()`.
     * 
     * @public
     * @this {RegExpLexer}
     */
    begin: function lexer_begin(condition) {
        return this.pushState(condition);
    },

    /**
     * activates a new lexer condition state (pushes the new lexer
     * condition state onto the condition stack)
     * 
     * @public
     * @this {RegExpLexer}
     */
    pushState: function lexer_pushState(condition) {
        this.conditionStack.push(condition);
        this.__currentRuleSet__ = null;
        return this;
    },

    /**
     * pop the previously active lexer condition state off the condition
     * stack
     * 
     * @public
     * @this {RegExpLexer}
     */
    popState: function lexer_popState() {
        var n = this.conditionStack.length - 1;
        if (n > 0) {
            this.__currentRuleSet__ = null; 
            return this.conditionStack.pop();
        } else {
            return this.conditionStack[0];
        }
    },

    /**
     * return the currently active lexer condition state; when an index
     * argument is provided it produces the N-th previous condition state,
     * if available
     * 
     * @public
     * @this {RegExpLexer}
     */
    topState: function lexer_topState(n) {
        n = this.conditionStack.length - 1 - Math.abs(n || 0);
        if (n >= 0) {
            return this.conditionStack[n];
        } else {
            return 'INITIAL';
        }
    },

    /**
     * (internal) determine the lexer rule set which is active for the
     * currently active lexer condition state
     * 
     * @public
     * @this {RegExpLexer}
     */
    _currentRules: function lexer__currentRules() {
        if (this.conditionStack.length && this.conditionStack[this.conditionStack.length - 1]) {
            return this.conditions[this.conditionStack[this.conditionStack.length - 1]];
        } else {
            return this.conditions['INITIAL'];
        }
    },

    /**
     * return the number of states currently on the stack
     * 
     * @public
     * @this {RegExpLexer}
     */
    stateStackSize: function lexer_stateStackSize() {
        return this.conditionStack.length;
    },
    options: {
  flex: true,
  trackPosition: true,
  parseActionsUseYYMERGELOCATIONINFO: true
},
    JisonLexerError: JisonLexerError,
    performAction: function lexer__performAction(yy, yyrulenumber, YY_START) {
            var yy_ = this;

            
var YYSTATE = YY_START;
switch(yyrulenumber) {
case 0 : 
/*! Conditions:: * */ 
/*! Rule::       \s+ */ 
 return; 
break;
case 5 : 
/*! Conditions:: INITIAL */ 
/*! Rule::       \{% */ 
 this.begin('CONTROL');      return 28; 
break;
case 6 : 
/*! Conditions:: INITIAL */ 
/*! Rule::       <!-- */ 
 this.begin('COMMENT');      return; 
break;
case 7 : 
/*! Conditions:: INITIAL */ 
/*! Rule::       < */ 
 this.begin('TAG');          return 13; 
break;
case 8 : 
/*! Conditions:: INITIAL */ 
/*! Rule::       \{\{ */ 
 this.begin('EXPRESSION')    return 39; 
break;
case 15 : 
/*! Conditions:: TAG */ 
/*! Rule::       \/> */ 
 this.popState();            return 37; 
break;
case 16 : 
/*! Conditions:: TAG */ 
/*! Rule::       > */ 
 this.begin('CHILDREN');     return 14; 
break;
case 17 : 
/*! Conditions:: TAG */ 
/*! Rule::       \{\{ */ 
 this.begin('EXPRESSION');   return 39; 
break;
case 18 : 
/*! Conditions:: CHILDREN */ 
/*! Rule::       \{\{ */ 
 this.begin('EXPRESSION');   return 39; 
break;
case 19 : 
/*! Conditions:: CHILDREN */ 
/*! Rule::       \{% */ 
 this.begin('CONTROL');      return 28; 
break;
case 20 : 
/*! Conditions:: CHILDREN */ 
/*! Rule::       <!-- */ 
 this.begin('COMMENT');      return; 
break;
case 21 : 
/*! Conditions:: CHILDREN */ 
/*! Rule::       <\/ */ 
 this.begin('TAG'); return 36; 
break;
case 22 : 
/*! Conditions:: CHILDREN */ 
/*! Rule::       < */ 
 this.begin('TAG'); return 13; 
break;
case 23 : 
/*! Conditions:: CHILDREN */ 
/*! Rule::       [^/<>{%}]+ */ 
 this.popState();            return 48; 
break;
case 51 : 
/*! Conditions:: CONTROL */ 
/*! Rule::       = */ 
 this.begin('CONTROL_CHILD');return 7; 
break;
case 54 : 
/*! Conditions:: CONTROL */ 
/*! Rule::       %\} */ 
 this.popState();            return 30; 
break;
case 55 : 
/*! Conditions:: CONTROL_CHILD */ 
/*! Rule::       < */ 
 this.begin('TAG');          return 13; 
break;
case 56 : 
/*! Conditions:: CONTROL_CHILD */ 
/*! Rule::       \{\{ */ 
 this.begin('EXPRESSION');   return 39; 
break;
case 57 : 
/*! Conditions:: CONTROL_CHILD */ 
/*! Rule::       %\} */ 
 this.popState();            return 30; 
break;
case 73 : 
/*! Conditions:: EXPRESSION */ 
/*! Rule::       \}\} */ 
 this.popState();            return 40; 
break;
case 74 : 
/*! Conditions:: COMMENT */ 
/*! Rule::       (.|\r|\n)*?--> */ 
 this.popState();            return; 
break;
case 105 : 
/*! Conditions:: INITIAL */ 
/*! Rule::       . */ 
 console.log("", yy_.yytext); /* `flex` lexing mode: the last resort rule! */ 
break;
default:
  return this.simpleCaseActionClusters[yyrulenumber];
}
        },
    simpleCaseActionClusters: {

  /*! Conditions:: INITIAL */ 
  /*! Rule::       import */ 
   1 : 25,
  /*! Conditions:: INITIAL */ 
  /*! Rule::       from */ 
   2 : 26,
  /*! Conditions:: INITIAL */ 
  /*! Rule::       using */ 
   3 : 29,
  /*! Conditions:: INITIAL */ 
  /*! Rule::       as */ 
   4 : 27,
  /*! Conditions:: INITIAL */ 
  /*! Rule::       {Constructor} */ 
   9 : 57,
  /*! Conditions:: INITIAL */ 
  /*! Rule::       {Identifier} */ 
   10 : 38,
  /*! Conditions:: TAG */ 
  /*! Rule::       true */ 
   11 : 55,
  /*! Conditions:: TAG */ 
  /*! Rule::       false */ 
   12 : 56,
  /*! Conditions:: TAG */ 
  /*! Rule::       {Constructor} */ 
   13 : 57,
  /*! Conditions:: TAG */ 
  /*! Rule::       {Identifier} */ 
   14 : 38,
  /*! Conditions:: CONTROL */ 
  /*! Rule::       macro */ 
   24 : 'MACRO',
  /*! Conditions:: CONTROL */ 
  /*! Rule::       endmacro */ 
   25 : 'ENDMACRO',
  /*! Conditions:: CONTROL */ 
  /*! Rule::       for */ 
   26 : 41,
  /*! Conditions:: CONTROL */ 
  /*! Rule::       endfor */ 
   27 : 43,
  /*! Conditions:: CONTROL */ 
  /*! Rule::       if */ 
   28 : 45,
  /*! Conditions:: CONTROL */ 
  /*! Rule::       endif */ 
   29 : 47,
  /*! Conditions:: CONTROL */ 
  /*! Rule::       else */ 
   30 : 46,
  /*! Conditions:: CONTROL */ 
  /*! Rule::       elseif */ 
   31 : 'ELSEIF',
  /*! Conditions:: CONTROL */ 
  /*! Rule::       in */ 
   32 : 42,
  /*! Conditions:: CONTROL */ 
  /*! Rule::       case */ 
   33 : 'CASE',
  /*! Conditions:: CONTROL */ 
  /*! Rule::       endcase */ 
   34 : 'ENDCASE',
  /*! Conditions:: CONTROL */ 
  /*! Rule::       export */ 
   35 : 31,
  /*! Conditions:: CONTROL */ 
  /*! Rule::       from */ 
   36 : 26,
  /*! Conditions:: CONTROL */ 
  /*! Rule::       view */ 
   37 : 32,
  /*! Conditions:: CONTROL */ 
  /*! Rule::       using */ 
   38 : 29,
  /*! Conditions:: CONTROL */ 
  /*! Rule::       endview */ 
   39 : 33,
  /*! Conditions:: CONTROL */ 
  /*! Rule::       match */ 
   40 : 'MATCH',
  /*! Conditions:: CONTROL */ 
  /*! Rule::       endmatch */ 
   41 : 'ENDMATCH',
  /*! Conditions:: CONTROL */ 
  /*! Rule::       instanceof */ 
   42 : 64,
  /*! Conditions:: CONTROL */ 
  /*! Rule::       typeof */ 
   43 : 'TYPEOF',
  /*! Conditions:: CONTROL */ 
  /*! Rule::       this */ 
   44 : 'THIS',
  /*! Conditions:: CONTROL */ 
  /*! Rule::       fun */ 
   45 : 34,
  /*! Conditions:: CONTROL */ 
  /*! Rule::       endfun */ 
   46 : 35,
  /*! Conditions:: CONTROL */ 
  /*! Rule::       as */ 
   47 : 27,
  /*! Conditions:: CONTROL */ 
  /*! Rule::       :: */ 
   48 : '::',
  /*! Conditions:: CONTROL */ 
  /*! Rule::       @ */ 
   49 : 19,
  /*! Conditions:: CONTROL */ 
  /*! Rule::       \(\) */ 
   50 : '()',
  /*! Conditions:: CONTROL */ 
  /*! Rule::       {Constructor} */ 
   52 : 57,
  /*! Conditions:: CONTROL */ 
  /*! Rule::       {Identifier} */ 
   53 : 38,
  /*! Conditions:: CONTROL_CHILD */ 
  /*! Rule::       {Constructor} */ 
   58 : 57,
  /*! Conditions:: CONTROL_CHILD */ 
  /*! Rule::       {Identifier} */ 
   59 : 38,
  /*! Conditions:: EXPRESSION */ 
  /*! Rule::       \| */ 
   60 : 15,
  /*! Conditions:: EXPRESSION */ 
  /*! Rule::       => */ 
   61 : 52,
  /*! Conditions:: EXPRESSION */ 
  /*! Rule::       -> */ 
   62 : '->',
  /*! Conditions:: EXPRESSION */ 
  /*! Rule::       @ */ 
   63 : 19,
  /*! Conditions:: EXPRESSION */ 
  /*! Rule::       instanceof */ 
   64 : 64,
  /*! Conditions:: EXPRESSION */ 
  /*! Rule::       true */ 
   65 : 55,
  /*! Conditions:: EXPRESSION */ 
  /*! Rule::       false */ 
   66 : 56,
  /*! Conditions:: EXPRESSION */ 
  /*! Rule::       if */ 
   67 : 45,
  /*! Conditions:: EXPRESSION */ 
  /*! Rule::       then */ 
   68 : 49,
  /*! Conditions:: EXPRESSION */ 
  /*! Rule::       else */ 
   69 : 46,
  /*! Conditions:: EXPRESSION */ 
  /*! Rule::       as */ 
   70 : 27,
  /*! Conditions:: EXPRESSION */ 
  /*! Rule::       {Constructor} */ 
   71 : 57,
  /*! Conditions:: EXPRESSION */ 
  /*! Rule::       {Identifier} */ 
   72 : 38,
  /*! Conditions:: * */ 
  /*! Rule::       {NumberLiteral} */ 
   75 : 54,
  /*! Conditions:: * */ 
  /*! Rule::       {StringLiteral} */ 
   76 : 53,
  /*! Conditions:: * */ 
  /*! Rule::       > */ 
   77 : 14,
  /*! Conditions:: * */ 
  /*! Rule::       < */ 
   78 : 13,
  /*! Conditions:: * */ 
  /*! Rule::       \( */ 
   79 : 11,
  /*! Conditions:: * */ 
  /*! Rule::       \) */ 
   80 : 12,
  /*! Conditions:: * */ 
  /*! Rule::       \[ */ 
   81 : 8,
  /*! Conditions:: * */ 
  /*! Rule::       \] */ 
   82 : 9,
  /*! Conditions:: * */ 
  /*! Rule::       ; */ 
   83 : 20,
  /*! Conditions:: * */ 
  /*! Rule::       : */ 
   84 : 10,
  /*! Conditions:: * */ 
  /*! Rule::       = */ 
   85 : 7,
  /*! Conditions:: * */ 
  /*! Rule::       == */ 
   86 : 60,
  /*! Conditions:: * */ 
  /*! Rule::       != */ 
   87 : 61,
  /*! Conditions:: * */ 
  /*! Rule::       >= */ 
   88 : 58,
  /*! Conditions:: * */ 
  /*! Rule::       <= */ 
   89 : 59,
  /*! Conditions:: * */ 
  /*! Rule::       \+ */ 
   90 : 21,
  /*! Conditions:: * */ 
  /*! Rule::       - */ 
   91 : 23,
  /*! Conditions:: * */ 
  /*! Rule::       \* */ 
   92 : 3,
  /*! Conditions:: * */ 
  /*! Rule::       \/ */ 
   93 : 22,
  /*! Conditions:: * */ 
  /*! Rule::       \\ */ 
   94 : 51,
  /*! Conditions:: * */ 
  /*! Rule::       && */ 
   95 : 62,
  /*! Conditions:: * */ 
  /*! Rule::       \|\| */ 
   96 : 63,
  /*! Conditions:: * */ 
  /*! Rule::       \^ */ 
   97 : 24,
  /*! Conditions:: * */ 
  /*! Rule::       ! */ 
   98 : 16,
  /*! Conditions:: * */ 
  /*! Rule::       , */ 
   99 : 6,
  /*! Conditions:: * */ 
  /*! Rule::       \? */ 
   100 : 18,
  /*! Conditions:: * */ 
  /*! Rule::       \. */ 
   101 : 17,
  /*! Conditions:: * */ 
  /*! Rule::       \{ */ 
   102 : 4,
  /*! Conditions:: * */ 
  /*! Rule::       \} */ 
   103 : 5,
  /*! Conditions:: * */ 
  /*! Rule::       $ */ 
   104 : 1
},
    rules: [
        /*   0: */  /^(?:\s+)/,
/*   1: */  /^(?:import)/,
/*   2: */  /^(?:from)/,
/*   3: */  /^(?:using)/,
/*   4: */  /^(?:as)/,
/*   5: */  /^(?:\{%)/,
/*   6: */  /^(?:<!--)/,
/*   7: */  /^(?:<)/,
/*   8: */  /^(?:\{\{)/,
/*   9: */  /^(?:([A-Z][\w$\-]*))/,
/*  10: */  /^(?:([$_a-z][\w$\-]*))/,
/*  11: */  /^(?:true)/,
/*  12: */  /^(?:false)/,
/*  13: */  /^(?:([A-Z][\w$\-]*))/,
/*  14: */  /^(?:([$_a-z][\w$\-]*))/,
/*  15: */  /^(?:\/>)/,
/*  16: */  /^(?:>)/,
/*  17: */  /^(?:\{\{)/,
/*  18: */  /^(?:\{\{)/,
/*  19: */  /^(?:\{%)/,
/*  20: */  /^(?:<!--)/,
/*  21: */  /^(?:<\/)/,
/*  22: */  /^(?:<)/,
/*  23: */  /^(?:[^\/<>{%}]+)/,
/*  24: */  /^(?:macro)/,
/*  25: */  /^(?:endmacro)/,
/*  26: */  /^(?:for)/,
/*  27: */  /^(?:endfor)/,
/*  28: */  /^(?:if)/,
/*  29: */  /^(?:endif)/,
/*  30: */  /^(?:else)/,
/*  31: */  /^(?:elseif)/,
/*  32: */  /^(?:in)/,
/*  33: */  /^(?:case)/,
/*  34: */  /^(?:endcase)/,
/*  35: */  /^(?:export)/,
/*  36: */  /^(?:from)/,
/*  37: */  /^(?:view)/,
/*  38: */  /^(?:using)/,
/*  39: */  /^(?:endview)/,
/*  40: */  /^(?:match)/,
/*  41: */  /^(?:endmatch)/,
/*  42: */  /^(?:instanceof)/,
/*  43: */  /^(?:typeof)/,
/*  44: */  /^(?:this)/,
/*  45: */  /^(?:fun)/,
/*  46: */  /^(?:endfun)/,
/*  47: */  /^(?:as)/,
/*  48: */  /^(?:::)/,
/*  49: */  /^(?:@)/,
/*  50: */  /^(?:\(\))/,
/*  51: */  /^(?:=)/,
/*  52: */  /^(?:([A-Z][\w$\-]*))/,
/*  53: */  /^(?:([$_a-z][\w$\-]*))/,
/*  54: */  /^(?:%\})/,
/*  55: */  /^(?:<)/,
/*  56: */  /^(?:\{\{)/,
/*  57: */  /^(?:%\})/,
/*  58: */  /^(?:([A-Z][\w$\-]*))/,
/*  59: */  /^(?:([$_a-z][\w$\-]*))/,
/*  60: */  /^(?:\|)/,
/*  61: */  /^(?:=>)/,
/*  62: */  /^(?:->)/,
/*  63: */  /^(?:@)/,
/*  64: */  /^(?:instanceof)/,
/*  65: */  /^(?:true)/,
/*  66: */  /^(?:false)/,
/*  67: */  /^(?:if)/,
/*  68: */  /^(?:then)/,
/*  69: */  /^(?:else)/,
/*  70: */  /^(?:as)/,
/*  71: */  /^(?:([A-Z][\w$\-]*))/,
/*  72: */  /^(?:([$_a-z][\w$\-]*))/,
/*  73: */  /^(?:\}\})/,
/*  74: */  /^(?:(.|\r|\n)*?-->)/,
/*  75: */  /^(?:((?:([-]?(?:[-]?([0]|((?:[1-9])(?:\d+)*)))\.(?:\d+)*(?:(?:[Ee])(?:[+-]?\d+))?)|(\.(?:\d+)(?:(?:[Ee])(?:[+-]?\d+))?)|((?:[-]?([0]|((?:[1-9])(?:\d+)*)))(?:(?:[Ee])(?:[+-]?\d+))?))|(?:[0][Xx](?:[\dA-Fa-f])+)|(?:[0](?:[0-7])+)))/,
/*  76: */  /^(?:(("(?:([^\n\r"\\]+)|(\\(?:(?:(?:["'\\bfnrtv])|(?:[^\d"'\\bfnrt-vx]))|(?:(?:[1-7][0-7]{0,2}|[0-7]{2,3}))|(?:[x](?:[\dA-Fa-f]){2})|(?:[u](?:[\dA-Fa-f]){4})))|(?:\\(\r\n|\r|\n)))*")|('(?:([^\n\r'\\]+)|(\\(?:(?:(?:["'\\bfnrtv])|(?:[^\d"'\\bfnrt-vx]))|(?:(?:[1-7][0-7]{0,2}|[0-7]{2,3}))|(?:[x](?:[\dA-Fa-f]){2})|(?:[u](?:[\dA-Fa-f]){4})))|(?:\\(\r\n|\r|\n)))*')|(`(?:([^\n\r\\`]+)|(\\(?:(?:(?:["'\\bfnrtv])|(?:[^\d"'\\bfnrt-vx]))|(?:(?:[1-7][0-7]{0,2}|[0-7]{2,3}))|(?:[x](?:[\dA-Fa-f]){2})|(?:[u](?:[\dA-Fa-f]){4})))|(?:\\(\r\n|\r|\n)))*`)))/,
/*  77: */  /^(?:>)/,
/*  78: */  /^(?:<)/,
/*  79: */  /^(?:\()/,
/*  80: */  /^(?:\))/,
/*  81: */  /^(?:\[)/,
/*  82: */  /^(?:\])/,
/*  83: */  /^(?:;)/,
/*  84: */  /^(?::)/,
/*  85: */  /^(?:=)/,
/*  86: */  /^(?:==)/,
/*  87: */  /^(?:!=)/,
/*  88: */  /^(?:>=)/,
/*  89: */  /^(?:<=)/,
/*  90: */  /^(?:\+)/,
/*  91: */  /^(?:-)/,
/*  92: */  /^(?:\*)/,
/*  93: */  /^(?:\/)/,
/*  94: */  /^(?:\\)/,
/*  95: */  /^(?:&&)/,
/*  96: */  /^(?:\|\|)/,
/*  97: */  /^(?:\^)/,
/*  98: */  /^(?:!)/,
/*  99: */  /^(?:,)/,
/* 100: */  /^(?:\?)/,
/* 101: */  /^(?:\.)/,
/* 102: */  /^(?:\{)/,
/* 103: */  /^(?:\})/,
/* 104: */  /^(?:$)/,
/* 105: */  /^(?:.)/
    ],
    conditions: {
  "CHILDREN": {
    rules: [
      0,
      18,
      19,
      20,
      21,
      22,
      23,
      75,
      76,
      77,
      78,
      79,
      80,
      81,
      82,
      83,
      84,
      85,
      86,
      87,
      88,
      89,
      90,
      91,
      92,
      93,
      94,
      95,
      96,
      97,
      98,
      99,
      100,
      101,
      102,
      103,
      104
    ],
    inclusive: false
  },
  "COMMENT": {
    rules: [
      0,
      74,
      75,
      76,
      77,
      78,
      79,
      80,
      81,
      82,
      83,
      84,
      85,
      86,
      87,
      88,
      89,
      90,
      91,
      92,
      93,
      94,
      95,
      96,
      97,
      98,
      99,
      100,
      101,
      102,
      103,
      104
    ],
    inclusive: false
  },
  "CONTROL": {
    rules: [
      0,
      24,
      25,
      26,
      27,
      28,
      29,
      30,
      31,
      32,
      33,
      34,
      35,
      36,
      37,
      38,
      39,
      40,
      41,
      42,
      43,
      44,
      45,
      46,
      47,
      48,
      49,
      50,
      51,
      52,
      53,
      54,
      75,
      76,
      77,
      78,
      79,
      80,
      81,
      82,
      83,
      84,
      85,
      86,
      87,
      88,
      89,
      90,
      91,
      92,
      93,
      94,
      95,
      96,
      97,
      98,
      99,
      100,
      101,
      102,
      103,
      104
    ],
    inclusive: false
  },
  "EXPRESSION": {
    rules: [
      0,
      60,
      61,
      62,
      63,
      64,
      65,
      66,
      67,
      68,
      69,
      70,
      71,
      72,
      73,
      75,
      76,
      77,
      78,
      79,
      80,
      81,
      82,
      83,
      84,
      85,
      86,
      87,
      88,
      89,
      90,
      91,
      92,
      93,
      94,
      95,
      96,
      97,
      98,
      99,
      100,
      101,
      102,
      103,
      104
    ],
    inclusive: false
  },
  "CONTROL_CHILD": {
    rules: [
      0,
      55,
      56,
      57,
      58,
      59,
      75,
      76,
      77,
      78,
      79,
      80,
      81,
      82,
      83,
      84,
      85,
      86,
      87,
      88,
      89,
      90,
      91,
      92,
      93,
      94,
      95,
      96,
      97,
      98,
      99,
      100,
      101,
      102,
      103,
      104
    ],
    inclusive: false
  },
  "TAG": {
    rules: [
      0,
      11,
      12,
      13,
      14,
      15,
      16,
      17,
      75,
      76,
      77,
      78,
      79,
      80,
      81,
      82,
      83,
      84,
      85,
      86,
      87,
      88,
      89,
      90,
      91,
      92,
      93,
      94,
      95,
      96,
      97,
      98,
      99,
      100,
      101,
      102,
      103,
      104
    ],
    inclusive: false
  },
  "INITIAL": {
    rules: [
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      75,
      76,
      77,
      78,
      79,
      80,
      81,
      82,
      83,
      84,
      85,
      86,
      87,
      88,
      89,
      90,
      91,
      92,
      93,
      94,
      95,
      96,
      97,
      98,
      99,
      100,
      101,
      102,
      103,
      104,
      105
    ],
    inclusive: true
  }
}
};


return lexer;