const {app} = require('./app'),
    port = process.env.PORT;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
module.exports = {app};