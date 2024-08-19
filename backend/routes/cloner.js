import { getClonerService } from '../services/upstox/clonerService.js';

const clonerService = getClonerService();

const cloneSocketHandler = (ws) => {
    ws.on('message', async (message) => {
        message = JSON.parse(message);
        const clonerId = message.clonerId;
        if(message.operation === 'startCloning') {
            try {
                const result = await clonerService.startCloner(clonerId);
                if (!(result.success)) {
                    return ws.send(JSON.stringify({ operation: 'startCloning',success: false, message: result.message }))
                };
                ws.send(JSON.stringify({ operation: 'startCloning',success: true, clonerId }));
            }

            catch (err) {
                ws.send(JSON.stringify({ operation: 'startCloning',success: false, message: err.message }));
            }
        }

        if(message.operation === 'stopCloning') {
            try {
                const result = await clonerService.stopCloner(clonerId);
                if (!(result.success)) {
                    return ws.send(JSON.stringify({ operation: 'stopCloning',success: false, message: 'Cloner is already inactive' }));
                }
                ws.send(JSON.stringify({ operation: 'stopCloning',success: true, clonerId: result.clonerId }));
            }

            catch (err) {
                ws.send(JSON.stringify({operation: 'stopCloning', success: false, message: err.message }));
            }
        }
    })
}
/* clonerRouter.get('/start/:id', async (req, res) => {
    try {
        const clonerId = req.params.id;
        const result = await clonerService.startCloner(clonerId);
        if (!result.success) {
            return res.status(404).json({ success: false, message: result.message })
        };
        res.json({ success: true, clonerId });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

clonerRouter.get('/stop/:id', async (req, res) => {
    try {
        const clonerId = req.params.id;
        const result = await clonerService.stopCloner(clonerId);
        if (!result) {
            return res.status(400).json({ success: false, message: 'Cloner is already inactive' });
        }
        res.json({ success: true, result });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}) */

export default cloneSocketHandler