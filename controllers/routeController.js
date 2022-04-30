
module.exports.publicRoom = (req,res) => {
	res.render('home.ejs');
};

module.exports.checkForRoomId = (req,res) => {
    const roomid = req.params.roomid;

    if(roomid.length != 4 || roomid[0] === '0' || isNaN(roomid))
        res.send('Not a valid room');

    res.render('home.ejs');
};