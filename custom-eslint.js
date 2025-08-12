module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Swap quotes only for test descriptions in it()',
    },
    fixable: 'code',
    schema: [],
  },
  create(context) {
    return {
      Literal(node) {
        if (typeof node.value !== 'string') return;

        // Check if parent is an `it()` call
        if (
          node.parent &&
          node.parent.type === 'CallExpression' &&
          node.parent.callee.name === 'it' &&
          node.parent.arguments[0] === node
        ) {
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
              message:
                'Swap outer quotes to single and inner quotes to double in it() descriptions',
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
