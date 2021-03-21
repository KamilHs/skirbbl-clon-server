import { app } from "../servers";

import rooms from "../rooms";

app.get("/is_valid", (req, res) => {
    const id = req.query.id?.toString();
    if (!id) {
        return res.json({ isValidId: false });
    }

    return res.json({ isValidId: id in rooms });
});

export default app;
