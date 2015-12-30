/*
 *
 * mads - version 2.00.01
 * Copyright (c) 2015, Ninjoe
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * https://en.wikipedia.org/wiki/MIT_License
 * https://www.gnu.org/licenses/old-licenses/gpl-2.0.en.html
 *
 */
var mads = function () {
    /* Get Tracker */
    if (typeof custTracker == 'undefined' && typeof rma != 'undefined') {
        this.custTracker = rma.customize.custTracker;
    } else if (typeof custTracker != 'undefined') {
        this.custTracker = custTracker;
    } else {
        this.custTracker = [];
    }

    /* Unique ID on each initialise */
    this.id = this.uniqId();

    /* Tracked tracker */
    this.tracked = [];

    /* Body Tag */
    this.bodyTag = document.getElementsByTagName('body')[0];

    /* Head Tag */
    this.headTag = document.getElementsByTagName('head')[0];

    /* RMA Widget - Content Area */
    this.contentTag = document.getElementById('rma-widget');

    /* URL Path */
    this.path = typeof rma != 'undefined' ? rma.customize.src : '';
};

/* Generate unique ID */
mads.prototype.uniqId = function () {

    return new Date().getTime();
};

/* Link Opner */
mads.prototype.linkOpener = function (url) { console.log(url);

    if(typeof url != "undefined" && url !=""){
        if (typeof mraid !== 'undefined') {
            mraid.open(url);
        }else{
            window.open(url);
        }
    }
};

/* tracker */
mads.prototype.tracker = function (tt, type, name) {
    /* 
     * name is used to make sure that particular tracker is tracked for only once
     * there might have the same type in different location, so it will need the name to differentiate them
     */
    name = name || type;

    if ( typeof this.custTracker != 'undefined' && this.custTracker != '' && this.tracked.indexOf(name) == -1 ) {
        for (var i = 0; i < this.custTracker.length; i++) {
            if (type == 'diana' || type == 'gabi' || type == 'bonnie') {
                if (i == 1) return false;
            }

            var img = document.createElement('img');

            /* Insert Macro */
            var src = this.custTracker[i].replace('{{type}}', type);
            src = src.replace('{{tt}}', tt);
            /* */
            img.src = src + '&' + this.id;

            img.style.display = 'none';
            this.bodyTag.appendChild(img);

            this.tracked.push(name);
        }
    }
};

/* Load JS File */
mads.prototype.loadJs = function (js, callback) {
    var script = document.createElement('script');
    script.src = js;

    if (typeof callback != 'undefined') {
        script.onload = callback;
    }

    this.headTag.appendChild(script);
};

/* Load CSS File */
mads.prototype.loadCss = function (href) {
    var link = document.createElement('link');
    link.href = href;
    link.setAttribute('type', 'text/css');
    link.setAttribute('rel', 'stylesheet');

    this.headTag.appendChild(link);
};

var msgObj = {
    firstScreen : {
        textBelowHeader : 'Pilih tipe personality yang<br/>cocok denganmu',
        buttonText : [
            'Modis dan  ngga pernah<br/>ketinggalan mode',
            'Berjiwa pemimpin dan<br/>aktif berorganisasi',
            'Supel, ramah dan<br/>suka bergaul'
        ]
    },
    secondScreen : {
        whiteFigure : 'Drag deodoran<br/>pada karakter',
        blueFigure : '<p class="title">kamu Adalah</p>',
        diana : {
            description : 'Modis dan ngga pernah<br/>Ketinggalan mode'
        },
        bonnie : {
            description : 'Yang berjiwa pemimpin<br/>dan suka berorganisasi'
        },
        gabi : {
            description : 'Supel, ramah dan<br/>Suka bergaul'
        },
        prevLinkText : 'pilih karakter lain',
        nextLinkText : 'Lanjut'
    },
    lastScreen : {
        whiteBannerText : 'Tap Video untuk tau caranya<br/>tetap bersih, segar dan kering<br/> dengan rexona'
    },
    finalScreen : {
        finalBtnText : '<span class="big-text">Tap di sini</span><br/><span class="text">untuk info lebih lanjut</span>'
    }
};
var bonnieVideo;
var dianaVideo;
var gabiVideo;
var finalVideo;
var sdk = new mads();

var Ad = function () {
    // initialize MADS SDK
    this.sdk = new mads();
    var self = this;

    // Load local css
    this.sdk.loadCss( this.sdk.path + 'css/style.css');

    // Load local js
    this.sdk.loadJs( this.sdk.path + 'js/ninjoe.ytComponent.js');
    this.sdk.loadJs( this.sdk.path + 'js/jquery.js', function () {
        self.renderFirstScreen();
        self.trackHashChange();
    });

    this.preloadImages(this.sdk.bodyTag);
};

Ad.prototype.trackHashChange = function () {
    $(this.sdk.bodyTag).attr('onhashchange', 'setupRouting(this)');
};

function setupRouting (self) {
    var bonnieVideoExists = $('iframe#bonnie-video-3rd-screen').length;
    var gabiVideoExists = $('iframe#gabi-video-3rd-screen').length;
    var dianaVideoExists = $('iframe#diana-video-3rd-screen').length;
    var firstScreen = $('#first-screen');

    switch (location.hash) {
        case '':
            console.log('We are on first screen');
            $(ad.sdk.contentTag).html('');
            ad.renderFirstScreen();
            break;
        case '#bonnie':
            console.log('We are on Bonnnie\'s screen');
            console.log('Bonnie video state: ' + msgObj.bonnieVideoState);
            console.log('Bonnie video screen: ' + bonnieVideoExists);
            if ((!msgObj.bonnieVideoState || msgObj.bonnieVideoState == -1) && bonnieVideoExists == 1) {
                $(ad.sdk.contentTag).html('');
                ad.renderFirstScreen();
                location.hash = '';
            } else if (msgObj.bonnieVideoState && msgObj.bonnieVideoState != -1 && bonnieVideoExists == 1) {
                $('#wrapper').html('').hide();
                ad.addFooterNavigation(firstScreen);
            } else {
                $('#footer').remove();
            }

            /* @NOTE */
            $('#blue-figure').css('background', 'url("img/blue-figure.png") no-repeat')

            self.sdk.tracker('E', 'bonnie');

            break;
        case '#gabi':
            console.log('We are on Gabi\'s screen');
            console.log('Gabi video state: ' + msgObj.gabiVideoState);
            console.log('Gabi video screen: ' + gabiVideoExists);
            if ((!msgObj.gabiVideoState || msgObj.gabiVideoState == -1) && gabiVideoExists == 1) {
                $(ad.sdk.contentTag).html('');
                ad.renderFirstScreen();
                location.hash = '';
            } else if (msgObj.gabiVideoState && msgObj.gabiVideoState != -1 && gabiVideoExists == 1) {
                $('#wrapper').html('').hide();
                ad.addFooterNavigation(firstScreen);
            } else {
                $('#footer').remove();
            }

            /* @NOTE */
            $('#blue-figure').css('background', 'url("img/yellow-figure.png") no-repeat')

            self.sdk.tracker('E', 'gabi');

            break;
        case '#diana':
            console.log('We are on Diana\'s screen');
            console.log('Diana video state: ' + msgObj.dianaVideoState);
            console.log('Diana video screen: ' + dianaVideoExists);
            if ((!msgObj.dianaVideoState || msgObj.dianaVideoState == -1) && dianaVideoExists == 1) {
                $(ad.sdk.contentTag).html('');
                ad.renderFirstScreen();
                location.hash = '';
            } else if (msgObj.dianaVideoState && msgObj.dianaVideoState != -1 && dianaVideoExists == 1) {
                $('#wrapper').html('').hide();
                ad.addFooterNavigation(firstScreen);
            } else {
                $('#footer').remove();
            }

            /* @NOTE */
            $('#blue-figure').css('background', 'url("img/green-figure.png") no-repeat')

            self.sdk.tracker('E', 'diana');

            break;
        case '#last':
            ad.createLastScreen(firstScreen);
            break;
        case '#last-video':

            break;
        case '#final':
            ad.createFinalScreen(firstScreen);
            break;
    }
}

Ad.prototype.createFinalScreen = function (parent) {

    var  _this = this;

    var finalBtn = $('<a href="https://www.facebook.com/RexonaTeensIN" target="_blank" id="final-btn"></a>');

    $('#footer #next').hide();
    $('#first-screen #video-image').hide();
    $('#first-screen #white-figure-last-screen').hide();

    parent.append(finalBtn);
    finalBtn.html(msgObj.finalScreen.finalBtnText);

    $('#wrapper')
        .html('')
        .css({
            display: 'block',
            background: 'transparent',
            top: '-30px'
        })
        .click(function () {
            _this.sdk.linkOpener('https://www.facebook.com/RexonaTeensIN');
        });

    $('#rma-widget').on('click', function () {
        _this.sdk.tracker('CTR', 'landingpage');
    });
};

Ad.prototype.createLastScreen = function (parent) {
    var  _this = this;

    var lastHeaderBanner = $('<div id="header-banner-last"></div>');
    var videoImage = $('<div id="video-image"></div>');
    var clickable = $('<div id="lp_click_area"></div>');
    var girls = $('<div id="girls"></div>');
    var bigRexonaBottle = $('<div id="big-rexona-bottle"></div>');
    var whiteFigureLastScreen = $('<div id="white-figure-last-screen"></div>');

    $('#girl-diana').hide();
    $('#girl-bonnie').hide();
    $('#girl-gabi').hide();
    $('#header-banner').hide();
    $('#pink-figure').hide();
    $('#blue-figure').hide();
    $('#wrapper').hide();

    parent.append(lastHeaderBanner);
    parent.append(videoImage);
    parent.append(clickable);
    parent.append(girls);
    parent.append(bigRexonaBottle);
    parent.append(whiteFigureLastScreen);
    whiteFigureLastScreen.html('<span>' + msgObj.lastScreen.whiteBannerText + '</span>');

    //videoImage.on('click', function () {
    //    var wrapper = $('#wrapper');
    //
    //    location.hash = location.hash + '-video';
    //    wrapper.show();
    //
    //    if (!$('#final-video-screen').length) {
    //        wrapper.append('<div id="final-video-screen"></div>');
    //        finalVideo = new ytComponent({
    //            'container': 'final-video-screen',
    //            'width': '320',
    //            'height': '180',
    //            'videoId': 'zSSgvO90vtw',
    //            'tracker': sdk
    //        });
    //        finalVideo.onPlayerStateChange = function (e) {
    //            msgObj.finalVideoState = e.data;
    //            if (e.data == 0) {
    //                location.hash = '#last';
    //            }
    //        };
    //        if (window.onYouTubeIframeAPIReady) {
    //            finalVideo.loadVideo();
    //        } else {
    //            window.onYouTubeIframeAPIReady = function () {
    //                finalVideo.loadVideo();
    //            };
    //        }
    //    }
    //});

    clickable.on('click', function (e) {
        _this.sdk.linkOpener('https://www.youtube.com/watch?v=zSSgvO90vtw');
        _this.sdk.tracker('CTR', 'landingpage');
    });

    this.addFooterNavigationLast(parent);
};

Ad.prototype.addFooterNavigation = function (parent) {
    var footer = $('<div id="footer"></div>');
    var back = $('<a href="#" id="prev"><img src="' + this.sdk.path + 'img/left-arrow.png" /><span>' + msgObj.secondScreen.prevLinkText + '</span></a>');
    var next = $('<a href="#last" id="next"><span>' + msgObj.secondScreen.nextLinkText + '</span><img src="' + this.sdk.path + 'img/right-arrow.png" /></a>');

    footer.append(back);
    footer.append(next);
    parent.append(footer);

    if (location.hash == '#last') {
        $('#next').attr('href', '#final');
    }
};
Ad.prototype.addFooterNavigationLast = function (parent) {
    var footer = $('<div id="footer"></div>');
    var back = $('<a href="#" id="prev"><img src="' + this.sdk.path + 'img/left-arrow.png" /><span>' + msgObj.secondScreen.prevLinkText + '</span></a>');
    //var next = $('<a href="#final" id="next"><span>' + msgObj.secondScreen.nextLinkText + '</span><img src="' + this.sdk.path + 'img/right-arrow.png" /></a>');

    footer.append(back);
    //footer.append(next);
    parent.append(footer);
};

Ad.prototype.renderFirstScreen = function () {
    var firstScreen = $('<div id="first-screen"></div>');
    var logo = $('<div id="rexona-logo"></div>');
    var headerBanner = $('<div id="header-banner"></div>');
    var buttonsDiv = $('<div id="buttons"></div>');
    var textBelowBanner = $('<div id="text-below-banner"></div>');

    var btn;
    for (var j = 1; j <= 3; j++) {
        btn = $('<a class="btn" id="btn-' + j + '"></a>');
        btn.html(msgObj.firstScreen.buttonText[j - 1]);
        if (j === 1) {
            btn.attr('data-name', 'diana');
            btn.attr('href', '#diana');
        } else if (j === 2) {
            btn.attr('data-name', 'bonnie');
            btn.attr('href', '#bonnie');
        } else {
            btn.attr('data-name', 'gabi');
            btn.attr('href', '#gabi');
        }
        buttonsDiv.append(btn);
    }

    var girl;
    for (var i = 1; i <= 3; i++) {
        girl = $('<div class="girl" id="girl-' + i + '"></div>');
        firstScreen.append(girl);
    }

    firstScreen.append(logo);
    firstScreen.append(headerBanner);
    firstScreen.append(buttonsDiv);
    firstScreen.append(textBelowBanner);
    textBelowBanner.html(msgObj.firstScreen.textBelowHeader);

    $(this.sdk.contentTag).append(firstScreen);

    this.renderSecondScreen(msgObj);
};

Ad.prototype.renderSecondScreen = function (config) {
    var self = this;

    $('#buttons .btn').on('click', function () {
        var name = $(this).attr('data-name');
        var firstScreen = $('#first-screen');
        var pinkFigure = $('<div id="pink-figure"></div>');
        var blueFigure = $('<div id="blue-figure"></div>');
        var rexonaBottle = $('<div id="rexona-bottle"></div>');
        var whiteFigure = $('<div id="white-figure"></div>');
        var girl = $('<div id="girl-' + name + '"></div>');
        var wrapper = $('<div id="wrapper"></div>');

        firstScreen.css({
            background : 'transparent'
        });
        $('#text-below-banner').hide();
        $('#first-screen .girl').hide();
        $('#buttons .btn').hide();

        firstScreen.append(wrapper);
        firstScreen.append(pinkFigure);
        firstScreen.append(blueFigure);
        firstScreen.append(girl);
        firstScreen.append(whiteFigure);
        firstScreen.append(rexonaBottle);


        pinkFigure.html(config.secondScreen[name].description);
        pinkFigure.animate({
            left : '-20px'
        }, 1500, null);
        blueFigure.html(config.secondScreen.blueFigure + '<p class="name">' + name + '</p>');
        blueFigure.animate({
            left : '-20px'
        }, 1500, null);
        whiteFigure.html(config.secondScreen.whiteFigure);
        whiteFigure.animate({
            opacity : '1'
        }, 1500, null);
        rexonaBottle.animate({
            opacity : '1'
        }, 1500, null);
        girl.animate({
            right : '5px'
        }, 1500, null);

        rexonaBottle.on('click', createDragableArea);
        rexonaBottle.on('mousedown', createDragableArea);
        rexonaBottle.on('touchstart', createDragableArea);

        function createDragableArea () {

            self.sdk.tracker('E', name + '_drag');

            whiteFigure.remove();

            wrapper.on('mousemove', moveRexonaBottle);
            wrapper.on('click', moveRexonaBottle);
            wrapper.on('mousedown', moveRexonaBottle);
            rexonaBottle.on('touchstart', moveRexonaBottle_m);
            rexonaBottle.on('touchmove', moveRexonaBottle_m);

            function moveRexonaBottle (e) {
                var x = e.pageX;
                var y = e.pageY;

                rexonaBottle.css({
                    left : x + 'px',
                    top : y + 'px'
                });

                if (x >= 150 && x <= 260 && y >= 100 && y <= 300) {
                    cancelEvents();

                    setTimeout(function () {
                        self.createVideoOn3rdScreen();
                    }, 1500);
                }
            }

            function moveRexonaBottle_m (e) {
                e.preventDefault();
                var x = e.originalEvent.touches[0].pageX || e.originalEvent.changedTouches[0].pageX;
                var y = e.originalEvent.touches[0].pageY || e.originalEvent.changedTouches[0].pageY;

                rexonaBottle.css({
                    left : x + 'px',
                    top : y + 'px'
                });

                if (x >= 150 && x <= 260 && y >= 100 && y <= 300) {
                    cancelEvents();

                    setTimeout(function () {
                        self.createVideoOn3rdScreen();
                    }, 1500);
                }
            }

            function cancelEvents () {
                wrapper.off('click');
                wrapper.off('mousedown');
                wrapper.off('mousemove');
                wrapper.off('touchstart');
                wrapper.off('touchmove');
                wrapper.off('touchend');
                wrapper.off('mouseup');
                wrapper.off('mousemoveend');
            }
        }
    });
};

Ad.prototype.createVideoOn3rdScreen = function () {

    if (typeof window.navigator.vibrate !== 'undefined')
        window.navigator.vibrate(200);

    var wrapper = $('#wrapper');
    var rexonaBottle = $('#rexona-bottle');

    var _this = this;

    rexonaBottle.remove();
    wrapper.css({
        backgroundColor : '#000000'
    });

    if (location.hash == "#bonnie") {
        if (!$('#bonnie-video-3rd-screen').length) {
            wrapper.append('<div id="bonnie-video-3rd-screen"></div>');
            bonnieVideo = new ytComponent({
                'container' : 'bonnie-video-3rd-screen',
                'width' : '320',
                'height' : '180',
                'videoId' : 'zSSgvO90vtw',
                'tracker' : sdk
            });
            bonnieVideo.onPlayerStateChange = function (e) {
                msgObj.bonnieVideoState = e.data;
                if (e.data == 0) {
                    location.hash = '#last';
                } else if (e.data == 1) {
                    _this.sdk.tracker('E', 'bonnie_video');
                }
            };
            if (window.onYouTubeIframeAPIReady) {
                bonnieVideo.loadVideo();
            } else {
                window.onYouTubeIframeAPIReady = function () {
                    bonnieVideo.loadVideo();
                }
            }
        }
    } else if (location.hash == "#diana") {
        if (!$('#diana-video-3rd-screen').length) {
            wrapper.append('<div id="diana-video-3rd-screen"></div>');
            dianaVideo = new ytComponent({
                'container' : 'diana-video-3rd-screen',
                'width' : '320',
                'height' : '180',
                'videoId' : 'zSSgvO90vtw',
                'tracker' : sdk
            });
            dianaVideo.onPlayerStateChange = function (e) {
                msgObj.dianaVideoState = e.data;
                if (e.data == 0) {
                    location.hash = '#last';
                } else if (e.data == 1) {
                    _this.sdk.tracker('E', 'diana_video');
                }
            };
            if (window.onYouTubeIframeAPIReady) {
                dianaVideo.loadVideo();
            } else {
                window.onYouTubeIframeAPIReady = function () {
                    dianaVideo.loadVideo();
                }
            }
        }
    } else {
        if (!$('#gabi-video-3rd-screen').length) {
            wrapper.append('<div id="gabi-video-3rd-screen"></div>');
            gabiVideo = new ytComponent({
                'container': 'gabi-video-3rd-screen',
                'width': '320',
                'height': '180',
                'videoId': 'zSSgvO90vtw',
                'tracker': sdk
            });
            gabiVideo.onPlayerStateChange = function (e) { console.log(e);
                msgObj.gabiVideoState = e.data;
                if (e.data == 0) {
                    location.hash = '#last';
                } else if (e.data == 1) {
                    _this.sdk.tracker('E', 'gabi_video');
                }
            };
            if (window.onYouTubeIframeAPIReady) {
                gabiVideo.loadVideo();
            } else {
                window.onYouTubeIframeAPIReady = function () {
                    gabiVideo.loadVideo();
                }
            }
        }
    }

    if (location.hash == '#bonnie' || location.hash == '#gabi' || location.hash == '#diana') {
        location.hash = location.hash + '-video';
    }
};

Ad.prototype.preloadImages = function (parent) {
    var script = document.createElement('SCRIPT');
    var str = '';

    str = str +
    'var pic1 = new Image();' +
    'var pic2 = new Image();' +
    'var pic3 = new Image();' +
    'var pic4 = new Image();' +
    'var pic5 = new Image();' +
    'var pic6 = new Image();' +
    'var pic7 = new Image();' +
    'var pic8 = new Image();' +
    'var pic9 = new Image();' +
    'var pic10 = new Image();' +
    'var pic11 = new Image();' +
    'var pic12 = new Image();' +
    'var pic13 = new Image();' +
    'var pic14 = new Image();' +
    'var pic15 = new Image();' +
    'var pic16 = new Image();' +
    'var pic17 = new Image();' +
    'var pic18 = new Image();' +
    'var pic19 = new Image();' +
    'var pic20 = new Image();' +
    'var pic21 = new Image();' +
    'var pic22 = new Image();' +
    'var pic23 = new Image();' +
    'var pic24 = new Image();' +
    'var pic25 = new Image();' +
    'var pic26 = new Image();' +
    'var pic27 = new Image();' +
    'var pic28 = new Image();' +
    'pic1.src="img/bg.png";' +
    'pic2.src="img/big-rexona-bottle.png";' +
    'pic3.src="img/blue-btn-bg-rounded.png";' +
    'pic4.src="img/blue-figure.png";' +
    'pic5.src="img/bonnie.png";' +
    'pic6.src="img/diana.png";' +
    'pic7.src="img/final-blue-btn.png";' +
    'pic8.src="img/first-screen-bg.png";' +
    'pic9.src="img/footer-bg.png";' +
    'pic10.src="img/gabi.png";' +
    'pic11.src="img/girl-1.png";' +
    'pic12.src="img/girl-2.png";' +
    'pic13.src="img/girl-3.png";' +
    'pic14.src="img/girls.png";' +
    'pic15.src="img/left-arrow.png";' +
    'pic16.src="img/pink-blue-figures.png";' +
    'pic17.src="img/pink-figure.png";' +
    'pic18.src="img/pink-header-banner.png";' +
    'pic19.src="img/rexona-bottle.png";' +
    'pic20.src="img/rexona-logo.png";' +
    'pic21.src="img/right-arrow.png";' +
    'pic22.src="img/video.png";' +
    'pic23.src="img/white-figure-last-screen.png";' +
    'pic24.src="img/green-btn-bg-rounded.png";' +
    'pic25.src="img/yellow-btn-bg-rounded.png";' +
    'pic26.src="img/green-figure.png";' +
    'pic27.src="img/yellow-figure.png";' +
    'pic28.src="img/white-figure-with-arrow.png";';

    script.innerHTML = str;

    parent.appendChild(script);
};

var ad = new Ad();