// Copyright (c) 2021-2023 FlyByWire Simulations
//
// SPDX-License-Identifier: GPL-3.0

module.exports = {
    root: true,
    env: {
        browser: true,
        es2021: true,
    },
    // DO NOT CHANGE THIS FILE (unless you are an admin) (if admin, make sure you change the same file in the latest asobo branch as well)
    rules: {
        "indent": [
            "error",
            4,
            { SwitchCase: 1 },
        ],
        "linebreak-style": "off",
        // No quotes option is really fully consistent, so probably best to jsut not enforce either type
        "quotes": "off",
        "semi": ["error", "always"],
        "curly": ["error", "all"],
        "brace-style": ["error", "1tbs"],
        "space-before-blocks": "error",
        "space-before-function-paren": [
            "error",
            {
                anonymous: "always",
                named: "never",
                asyncArrow: "always",
            },
        ],
        "space-in-parens": "error",
        "space-infix-ops": "error",
        "space-unary-ops": "error",
        "keyword-spacing": "error",
        "no-irregular-whitespace": "error",
        "no-trailing-spaces": "error",
        "semi-spacing": "error",
        "no-mixed-spaces-and-tabs": "error",
        "no-multi-spaces": "error",
        // There are too many vars that cant be autofixed
        "no-var": "off",
        "prefer-const": [
            "error",
            { destructuring: "all" },
        ],
        // The vanilla code already has over 100 console.logs, but maybe we can enable this in master and delete them there
        "no-console": "off",
        "no-debugger": "error",
        "eol-last": ["error", "always"],
        "no-multiple-empty-lines": [
            "error",
            {
                max: 1,
                maxBOF: 0,
                maxEOF: 0,
            },
        ],
    },
};
