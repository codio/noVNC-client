export const init = () => {
    const prodRe = /https:\/\/.+\.codio\.io$/;
    const prodUkRe = /https:\/\/.+\.codio-box\.uk$/;
    const isProd = prodRe.test(location.origin) || prodUkRe.test(location.origin);

    window.Sentry?.init({
        // No need to configure DSN here, it is already configured in the loader script
        // You can add any additional configuration here
        dsn: "https://d08e273c89d12afcde41b3ec30d37ace@o108517.ingest.us.sentry.io/4505750448439296",
        release: 'TAG_VERSION',
        environment: isProd ? 'production' : 'development',
        ignoreErrors: [
            'ResizeObserver loop completed with undelivered notifications' // https://bugzilla.mozilla.org/show_bug.cgi?id=1685038
        ]
    });
};


