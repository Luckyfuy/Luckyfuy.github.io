!function (e, t, a) { 
    var initCopyCode = function() {
        var copyHtml = '';
        copyHtml += '<button class="btn-copy" data-clipboard-snippet="">';
        copyHtml += '  <i class="fa fa-clipboard"></i><span>copy</span>';
        copyHtml += '</button>';
        $(".highlight .code pre").before(copyHtml);
        new ClipboardJS('.btn-copy', {
            target: function(trigger) {
                return trigger.nextElementSibling;
            }
        });
    }
    initCopyCode();
}
(window, document);