export type Config = {
    type: "script" | "link"
    url: string
    options?: { async: boolean; defer: boolean }
    test: () => boolean
}

export function asyncScriptLoader(config: Config) {
    config.options ??= { async: true, defer: true }
    const { type, url, test, options } = config

    return new Promise<void>(async onload => {
        if (test()) onload()

        const attributes =
            type === "script"
                ? {
                      ...options,
                      src: url
                  }
                : {
                      rel: "stylesheet",
                      href: url
                  }

        const tag = document.createElement(type)

        // @ts-ignore
        Object.entries({ onload, ...attributes }).forEach(([key, value]) => (tag[key] = value))

        document.body.appendChild(tag)
    })
}
