module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Swap quotes only when outer single quotes contain double quotes followed by $',
    },
    fixable: 'code',
    schema: [],
  },
  create(context) {
    return {
      Literal(node) {
        if (typeof node.value !== 'string') return;

        const raw = context.getSourceCode().getText(node);

        // Check outer single quotes
        if (raw.startsWith("'") && raw.endsWith("'")) {
          const inner = raw.slice(1, -1);

          // Match double quotes immediately followed by $
          if (/\"\$/.test(inner)) {
            // Replace inner double quotes with single quotes
            const fixedInner = inner.replace(/"\$/g, "'$");

            // Swap outer single quotes to double quotes
            const fixed = `"${fixedInner}"`;

            context.report({
              node,
              message:
                'Outer single quotes with inner double quotes followed by $ should be swapped',
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
