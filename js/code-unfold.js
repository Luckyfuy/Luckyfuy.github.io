var CODE_MAX_HEIGHT = 200;
var containers = [];

// 展开
$('body').on('click', '.js_unfold_code_btn', function () {
  $(this).closest('.js_highlight_container').addClass('on');
});
// 收起
$('body').on('click', '.js_retract_code_btn', function () {
  var $container = $(this).closest('.js_highlight_container').removeClass('on');
  var winTop = $(window).scrollTop();
  var offsetTop = $container.offset().top;
  $(this).css('top', 0);
  if (winTop > offsetTop) {
    // 设置滚动条位置
    $('body, html').animate({
      scrollTop: $container.offset().top - CODE_MAX_HEIGHT
    }, 600);
  }
});
// 滚动事件，触发动画效果
$(window).on('scroll', function () {
  var scrollTop = $(window).scrollTop();
  var temp = [];
  for (let i = 0; i < containers.length; i++) {
    var item = containers[i];
    var { $container, height, $hide, hasHorizontalScrollbar } = item;
    if ($container.closest('body').length === 0) {
      // 如果 $container 元素已经不在页面上, 则删除该元素
      // 防止pjax页面跳转之后，元素未删除
      continue;
    }
    temp.push(item);
    if (!$container.hasClass('on')) {
      continue;
    }
    var offsetTop = $container.offset().top;
    var hideBtnHeight = $hide.outerHeight();
    // 减去按钮高度，减去底部滚动条高度
    var maxTop = parseInt(height - (hasHorizontalScrollbar ? 17 : 0) - hideBtnHeight);
    let top = parseInt(
      Math.min(
        Math.max(scrollTop - offsetTop, 0), // 如果小于 0 ，则取 0
        maxTop,// 如果大于 height ，则取 height
      )
    );
    // 根据 sin 曲线设置"收起代码"位置
    var halfHeight = parseInt($(window).height() / 2 * Math.sin((top / maxTop) * 90 * (2 * Math.PI/360)));
    $hide.css('top', Math.min(top + halfHeight, maxTop));
  }
  containers = temp;
});

// 添加隐藏容器
function addCodeWrap($node) {
  var $container = $node.wrap('<div class="js_highlight_container highlight-container"><div class="highlight-wrap"></div></div>').closest('.js_highlight_container');

  // 底部 "展开代码" 与 侧边栏 "收起代码"
  var $btn = $(`
    <div class="highlight-footer">
      <a class="js_unfold_code_btn show-btn" href="javascript:;">展开代码<i class="fa fa-angle-down" aria-hidden="true"></i></a>
    </div>
    <a class="js_retract_code_btn hide-btn" href="javascript:;"><i class="fa fa-angle-up" aria-hidden="true"></i>收起代码</a>
  `);

  $container.append($btn);
  return $container;
};

function codeUnfold () {
  $('.highlight').each(function () {
    // 防止重复渲染
    if (this.__render__ === true) {
      return true;
    }
    this.__render__ = true;
    var $this = $(this);
    var height = $(this).outerHeight();
    if (height > CODE_MAX_HEIGHT) {
      // 添加展开&收起容器
      var $container = addCodeWrap($this, height);
      containers.push({
        $container,
        height,
        $hide: $container.find('.js_retract_code_btn'),
        hasHorizontalScrollbar: this.scrollWidth > this.offsetWidth,
      });
    }
  });
};
