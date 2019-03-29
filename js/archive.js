/*
Credits: this script is shamelessly borrowed from
https://github.com/kitian616/jekyll-TeXt-theme
*/
(function () {
  $(document).ready(function () {
    // 给数字添加滚动效果
    var postSizeNode = $('.js-post-sizes');
    var postSize = postSizeNode[0].innerText;
    // console.log('haha',postSize);
    
    function init() {
      var scrollObj = {
        el: postSizeNode,
        max: postSize,
        start: 0
      };
      // 执行数字的自增
      
      increase(scrollObj);
    }
    // 给数字添加滚动效果 函数
    function increase(obj) {
      var item = obj.el, num = obj.max, start = obj.start;
      time = setInterval(function () {
        start++;
        if (start > num) {
          start = num;
          clearInterval(time);
        }
        item.text(start)
      }, 40)
    };
    init();
  })
})();
