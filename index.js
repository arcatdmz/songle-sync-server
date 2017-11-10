
var express = require('express');
var SW = require('songle-widget');

// プレイヤーを初期化して楽曲をセット
var tokens = {
  "accessToken": "00000029-rnebxeK",
  "secretToken": "bQXfEAG7cuGqx3k9ED4myFpQoc4x4Z5E"
};
var player = new SW.Player(tokens);
player.useMedia(
  new SW.Media.Headless("https://www.youtube.com/watch?v=AS4q9yaWJkI")
);
player.addPlugin(new SW.Plugin.SongleSync());

// 巻き戻し処理
function rewind() {
  console.log('seek to 0');
  player.seekTo(0);
  setTimeout(function () {
    console.log('play');
    player.play();
  }, 1000);
}
rewind();

// 再生終了したら巻き戻す
player.on('finish', rewind);

// コンソールに時刻表示
setInterval(function () {
  console.log('server time:', player.position);
}, 1000);

// HTTPサーバ
var app = express();
app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));

app.get('/play', function (req, res) {
  player.play();
  res.json({ "message": "start playing" });
});

app.get('/pause', function (req, res) {
  player.pause();
  res.json({ "message": "pause playing" });
});

app.get('/rewind', function (req, res) {
  player.seekTo(0);
  res.json({ "message": "seek to the beginning" });
});

app.get('/', function (req, res) {
  res.render('index', tokens);
});

app.get('/json', function (req, res) {
  res.json({ "accessToken": tokens.accessToken });
});

app.listen(process.env.PORT || 8080);
