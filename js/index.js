(function() {
    var requrestAnimationFrame = window.requestAnimationFrame ||
                                window.mozRequestAnimationFrame ||
                                window.webkitRequestAnimationFrame ||
                                window.msRequestAnimationFrame;

    window.requestAnimationFrame = requestAnimationFrame;


    function Game() {
        this.score = {
            left: 0,
            right: 0
        };
        this.touch = new Audio('sounds/touch.mp3');
        this.success = new Audio('sounds/success.mp3');
        this.body = document.querySelector('body');
        this.leftScore = document.querySelector('.score .left');
        this.rightScore = document.querySelector('.score .right');
        this.leftRacket = document.querySelector('.left-racket');
        this.rightRacket = document.querySelector('.right-racket');
        this.renderScore = function() {
            this.leftScore.innerHTML = this.score.left;
            this.rightScore.innerHTML = this.score.right;
        };
        this.init = function() {
            var me = this;
            this.renderScore();
            this.generateBall();
            this.ball = new Ball(this);
            this.ball.move();
            this.addListeners();
        };
        this.generateBall = function() {
            this.ball = new Ball(this);
            this.ball.angle = 90;
            while (!(this.ball.angle % 90)) {
                this.ball.angle = Math.round(Math.random() * 360);
            }
            this.ball.element.style.top = this.body.offsetHeight / 2 + 'px';
            this.ball.element.style.left = this.body.offsetWidth / 2 + 'px';
        };
        this.restart = function() {
            var me = this;

            this.ball.stop = true;

            setTimeout(function() {
                me.generateBall();
                me.ball.move();
            }, 2000);
        };
        this.addListeners = function() {
            var me = this;
            var keypressed;
            document.addEventListener('keypress', function(e) {
                keypressed = true;
                var keypressHandler = function() {
                    switch(e.keyCode) {
                        case 97: //a
                            me.moveRacket(me.leftRacket, 'top'); break;
                        case 122: //z
                            me.moveRacket(me.leftRacket, 'bottom'); break;
                        case 107: //k
                            me.moveRacket(me.rightRacket, 'top'); break;
                        case 109: //m
                            me.moveRacket(me.rightRacket, 'bottom'); break;
                    }

                    if (keypressed) {
                        requestAnimationFrame(keypressHandler);
                    }

                };
                requestAnimationFrame(keypressHandler);
            });
            document.addEventListener('keyup', function() {
                keypressed = false;
                console.log('asd');
            });
        };
        this.moveRacket = function(racket, direction) {
            var racketTop = parseFloat(racket.style.top || racket.offsetTop);

            if (direction === 'top') {
                if (racketTop >= 0) {
                    racket.style.top = racketTop - 10 + 'px';
                }
            }
            if (direction === 'bottom') {
                if (racketTop + racket.offsetHeight < this.body.offsetHeight) {
                    if (racketTop + racket.offsetHeight + 10 > this.body.offsetHeight) {
                        racket.style.top = this.body.offsetHeight - racket.offsetHeight + 'px';
                    } else {
                        racket.style.top = racketTop + 10 + 'px';
                    }
                }
            }
        }
    }
    function Ball(game) {
        this.element = document.querySelector('.ball');
        this.body = document.querySelector('body');
        this.leftRacket = document.querySelector('.left-racket');
        this.rightRacket = document.querySelector('.right-racket');
        this.speed = 5;
        this.angle = 315;
        this.stop = false;
        this.game = game;

        this.checkPosition = function() {
            this.angle = this.angle % 360;

            var elemTop = parseFloat(this.element.style.top || this.element.offsetTop);
            var elemLeft = parseFloat(this.element.style.left || this.element.offsetLeft);

            var leftRocketTop = parseFloat(this.leftRacket.style.top || this.leftRacket.offsetTop);
            var rightRacketTop = parseFloat(this.rightRacket.style.top || this.rightRacket.offsetTop);

            if (elemTop <= 0) {
                this.updateHorizontalBordersAngle();
            } else if (elemTop + this.element.offsetHeight + 5 > this.body.offsetHeight) {
                this.updateHorizontalBordersAngle();
            } else if (elemLeft <= 60)  {
                if(elemTop + this.element.offsetHeight > leftRocketTop && elemTop < leftRocketTop + this.leftRacket.offsetHeight ) {
                    this.updateVerticalBordersAngle();

                    this.game.touch.play();
                } else {
                    this.game.score.right++;
                    this.game.renderScore();
                    this.game.success.play();
                    this.game.restart();
                }
            } else if (elemLeft + this.element.offsetWidth > this.body.offsetWidth - 60) {
                if(elemTop + this.element.offsetHeight > rightRacketTop && elemTop < rightRacketTop + this.rightRacket.offsetHeight ) {
                    this.updateVerticalBordersAngle();

                    this.game.touch.play();
                } else {
                    this.game.score.left++;
                    this.game.renderScore();
                    this.game.success.play();
                    this.game.restart();
                }
            }
        };
        this.updateHorizontalBordersAngle = function() {
            this.angle += (180 - this.angle) * 2;
        };
        this.updateVerticalBordersAngle = function() {
            this.angle += (90 - this.angle) * 2;
        };

        this.move = function() {

            var me = this;
            var move = function() {
                me.checkPosition();

                var elemTop = parseFloat(me.element.style.top || me.element.offsetTop);
                var elemLeft = parseFloat(me.element.style.left || me.element.offsetLeft);
                var point = {
                    top: elemTop,
                    left: elemLeft
                };

                point.top += me.speed * Math.sin(me.angle * (Math.PI / 180));
                point.left += me.speed * Math.cos(me.angle * (Math.PI / 180));

                me.element.style.left = point.left + 'px';
                me.element.style.top = point.top + 'px';

                if (!me.stop) {
                    requestAnimationFrame(move);
                }
            };

            requestAnimationFrame(move);
        };
    }
    document.addEventListener("DOMContentLoaded", function(event) {
        var game = new Game();
        game.init();
    });
})();
