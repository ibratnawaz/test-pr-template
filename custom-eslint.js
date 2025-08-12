// lib/rules/swap-quotes-precise.js
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'When outer quotes are single, convert inner "$var" -> \'$var\' and make outer quotes double',
    },
    fixable: 'code',
    schema: [],
  },

  create(context) {
    const sourceCode = context.getSourceCode();

    return {
      Literal(node) {
        // only process string literals
        if (typeof node.value !== 'string') return;

        const raw = sourceCode.getText(node); // includes the outer quotes as in source

        // proceed only if outer quotes are single quotes
        if (!(raw.startsWith("'") && raw.endsWith("'"))) return;

        // inner content (raw slice keeps escape sequences as they are in source)
        const inner = raw.slice(1, -1);

        // quick test: is there any pattern like "$...?"
        if (!/\"\$[^"]+\"/.test(inner)) return;

        // Replace all occurrences of "$..." with '$...' using a callback
        const fixedInner = inner.replace(/"\$([^"]+)"/g, function (_, varName) {
          // varName is the text after the $ up to the next double-quote
          // Build replacement explicitly to avoid $1 replacement pitfalls
          return "'" + "$" + varName + "'";
        });

        // Final literal with swapped outer quotes
        const fixed = '"' + fixedInner + '"';

        context.report({
          node,
          message:
            'Swap outer single quotes to double and convert inner "$var" to \'$var\'',
          fix(fixer) {
            return fixer.replaceText(node, fixed);
          },
        });
      },
    };
  },
};
