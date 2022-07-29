module.exports = {
    presets: [
        [
            '@babel/preset-env',
            {
                modules: false,
                targets: {
                    esmodules: true
                }
            }
        ]
    ],
    ignore: ['**/*.d.ts']
}
