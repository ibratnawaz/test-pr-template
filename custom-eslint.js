module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Swap outer double quotes to single quotes, and inner single quotes to double quotes only when inner contains $variable',
    },
    fixable: 'code',
    schema: [],
  },
  create(context) {
    return {
      Literal(node) {
        if (typeof node.value !== 'string') return;

        const raw = context.getSourceCode().getText(node);

        // Check outer double quotes
        if (raw.startsWith('"') && raw.endsWith('"')) {
          const inner = raw.slice(1, -1);

          // Match single-quoted $variable inside
          const singleQuotedDollarVar = /'\$[a-zA-Z0-9_]+/.test(inner);

          if (!singleQuotedDollarVar) return; // Skip if no match

          // Replace only inner single quotes with double quotes
          const fixedInner = inner.replace(/'(\$[a-zA-Z0-9_]+)'/g, '"$1"');

          // Wrap final string in single quotes
          const fixed = `'${fixedInner}'`;

          context.report({
            node,
            message:
              'Swap outer quotes to single and inner quotes to double for $variable placeholders',
            fix(fixer) {
              return fixer.replaceText(node, fixed);
            },
          });
        }
      },
    };
  },
};
