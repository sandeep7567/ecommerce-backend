import app from "./app";

const startServer = async () => {
    const PORT = 4000;
    try {
        app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.error(err);
        }
    }
};

void startServer();
