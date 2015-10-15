(function() {
    var requrestAnimationFrame = window.requestAnimationFrame ||
                                window.mozRequestAnimationFrame ||
                                window.webkitRequestAnimationFrame ||
                                window.msRequestAnimationFrame;

    window.requestAnimationFrame = requestAnimationFrame;


    function Ball() {
        this.element = document.querySelector('.ball');
        this.body = document.querySelector('body');
        this.speed = 5;
        //this.angle = -135;
        this.angle = 280;
    }
    Ball.prototype.checkPosition = function() {
        //this.isNearLeftRacket();
        //this.isNearRightRacket();
        this.checkWall();
    };
    Ball.prototype.checkWall = function() {
        var elemTop = parseFloat(this.element.style.top || this.element.offsetTop);
        var elemLeft = parseFloat(this.element.style.left || this.element.offsetLeft);

        if (elemTop <= 0) {
            this.updateHorizontalBordersAngle();
        } else if (elemTop + this.element.offsetHeight > this.body.offsetHeight) {
            this.updateHorizontalBordersAngle();
        } else if (elemLeft <= 0)  {
            this.updateVerticalBordersAngle();
        } else if (elemLeft -this.element.offsetWidth > this.body.offsetWidth) {
            this.updateVerticalBordersAngle();
        }
    };
    Ball.prototype.updateHorizontalBordersAngle = function() {
        var quarter = Math.ceil(this.angle / 90);
        switch (quarter) {
            case 1:
                this.angle = 90 - (this.angle - 90 * 3);
                break;
            case 2:
                this.angle = 90 + (this.angle - 90 * 2);
                break;
            case 3:
                this.angle = 90 + (this.angle - 90 * 2);
                break;
            case 4:
                this.angle = 90 - (this.angle - 90 * 3);
                break;
        }

    };
    Ball.prototype.updateVerticalBordersAngle = function() {
    }

    Ball.prototype.move = function() {

        var me = this;
        var move = function() {
            me.checkPosition();
            //debugger;

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



            requestAnimationFrame(move);
        };

        requestAnimationFrame(move);
    };
    document.addEventListener("DOMContentLoaded", function(event) {
        var ball = new Ball();
        ball.move();
    });
})();
