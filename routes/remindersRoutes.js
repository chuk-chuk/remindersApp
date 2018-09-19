const service = require('../query/service');

module.exports = (() => {
    /* eslint-disable global-require */
    const router = require('express').Router();
    
    router.get('/', (req, res, next) => {
        service.getAllReminders((err, result) => {
            if (err) {
                err.statusCode = 502;
                return next(err);
            } else {
                if (!result.length) {
                    return next({ statusCode: 404 });
                }
                return res.json(result);
            }
        });
    });
    
    router.get('/date/:date', (req, res, next) => {
        const createdDate = req.params.date;
        service.getReminderByDate(createdDate, (err, result) => {
            if (err) {
                err.status = 503;
                return next(err);
            } else {
                return res.json([result]);
            }
        });
    });
    
    router.get('/content/:content', (req, res, next) => {
        const { content } = req.params;
        service.getReminderByContent(content, (err, result) => {
            if (err) {
                err.statusCode = 503;
                return next(err);
            } else {
                return res.json([result]);
            }
        });
    });
    
    router.post('/', (req, res, next) => {
        console.log("REQQQQQ", req.body); 
        // REQQQQQ { 
        //         text: 'testing only',
        //         expired_by: '2018-01-24',
        //         userId: '5ba22d75e64c0a9cac4f0834' }
        service.postReminder(req.body.text, req.body.expired_by, req.body.userId, (err, reminder) => {
            if (err) {
                err.statusCode = 502;
                return next(err);
            } else {
                console.log('POSTED REM', reminder);
                return res.status(200).json([reminder]);
            }
        });
    });
    
    router.put('/:reminderId', (req, res, next) => {
        service.updateReminder(req.params.reminderId, req.body.text, req.body.expired_by, (err, object) => {
            if (err) {
                err.statusCode = 502;
                return next(err);
                // res.status(500).json({})
            } else {
                return res.status(200).json([object]);
            }
        });
    });
    
    router.delete('/:reminderId', (req, res, next) => {
        service.deleteReminderById(req.params.reminderId, (err, result) => {
            if (err) {
                err.statusCode = 502;
                return next(err);
            }
            if (result.n < 1) {
                return next();
            }
            return res.status(200).json([result]);
        });
    });
    return router;
})();
