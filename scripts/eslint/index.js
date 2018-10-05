module.exports = {
    rules: {
        'prefer-destructuring': [
            'warn',
            {
                VariableDeclarator: {
                    array: false,
                    object: true,
                },
                AssignmentExpression: {
                    array: true,
                    object: true,
                },
            },
            {
                enforceForRenamedProperties: false,
            },
        ],
        'no-restricted-syntax': [
            'warn',
            {
                selector: 'ForInStatement',
                message:
                    'for..in loops iterate over the entire prototype chain, which is virtually never what you want. Use Object.{keys,values,entries}, and iterate over the resulting array.',
            },
            {
                selector: 'ForOfStatement',
                message:
                    'iterators/generators require regenerator-runtime, which is too heavyweight for this guide to allow them. Separately, loops should be avoided in favor of array iterations.',
            },
            {
                selector: 'LabeledStatement',
                message: 'Labels are a form of GOTO; using them makes code confusing and hard to maintain and understand.',
            },
            {
                selector: 'WithStatement',
                message: '`with` is disallowed in strict mode because it makes code impossible to predict and optimize.',
            },
        ],
        indent: [
            'error',
            4,
            {
                SwitchCase: 1,
                VariableDeclarator: 1,
                outerIIFEBody: 1,
                // MemberExpression: null,
                FunctionDeclaration: {
                    parameters: 1,
                    body: 1,
                },
                FunctionExpression: {
                    parameters: 1,
                    body: 1,
                },
                CallExpression: {
                    arguments: 1,
                },
                ArrayExpression: 1,
                ObjectExpression: 1,
                ImportDeclaration: 1,
                flatTernaryExpressions: false,
                ignoredNodes: ['JSXElement', 'JSXElement *'],
            },
        ],
        'class-methods-use-this': 'warn',
        'no-undef': 'warn',
        'no-unreachable': 'warn',
        'no-unused-vars': 'warn',
        'no-underscore-dangle': 'off',
        'linebreak-style': ['error', 'windows'],
        'no-mixed-operators': [
            'off',
            {
                allowSamePrecedence: true,
            },
        ],
        'sort-imports': 'off',
        'import/first': 'off',
        // https://blog.javascripting.com/2015/09/07/fine-tuning-airbnbs-eslint-config/
        'max-len': [1, 140, 2, { ignoreComments: true }],
        'no-cond-assign': [2, 'except-parens'],
        radix: 0,
        'no-unused-vars': [1, { vars: 'local', args: 'none' }],
        'default-case': 0,
        'no-else-return': 0,
        'no-param-reassign': ['warn', { props: false }],
        'no-continue': 'warn',
        'no-lonely-if': 'warn',
        'no-console': 'off',
    },
};
