module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Swap outer double quotes to single quotes, and inner single quotes to double quotes',
    },
    fixable: 'code',
    schema: [],
  },
  create(context) {
    return {
      Literal(node) {
        if (typeof node.value !== 'string') return;

        const raw = context.getSourceCode().getText(node);

        // Only process if outer quotes are double
        if (raw.startsWith('"') && raw.endsWith('"')) {
          const inner = raw.slice(1, -1);

          // Replace inner single quotes with double quotes
          const fixedInner = inner.replace(/'/g, '"');

          // Build final string with outer single quotes
          const fixed = `'${fixedInner}'`;

          context.report({
            node,
            message: 'Swap outer quotes to single and inner quotes to double',
            fix(fixer) {
              return fixer.replaceText(node, fixed);
            },
          });
        }
      },
    };
  },
};
