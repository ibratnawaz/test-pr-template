module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Swap quotes when outer single quotes contain "$variable" patterns',
    },
    fixable: 'code',
    schema: [],
  },
  create(context) {
    return {
      Literal(node) {
        if (typeof node.value !== 'string') return;

        const raw = context.getSourceCode().getText(node);

        // Only check if outer quotes are single
        if (raw.startsWith("'") && raw.endsWith("'")) {
          const inner = raw.slice(1, -1);

          // Match only double quotes followed by $ and ending before another double quote
          if (/\"\$[A-Za-z0-9_]+\"/.test(inner)) {
            // Replace all "$var" → '$var'
            const fixedInner = inner.replace(/"\$([A-Za-z0-9_]+)"/g, "'\$$1'");

            // Swap outer quotes to double quotes
            const fixed = `"${fixedInner}"`;

            context.report({
              node,
              message: 'Swap outer single quotes to double and "$var" to \'$var\' inside',
              fix(fixer) {
                return fixer.replaceText(node, fixed);
              },
            });
          }
        }
      },
    };
  },
};
