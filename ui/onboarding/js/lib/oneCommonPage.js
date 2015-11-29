var jQ = jQuery.noConflict();
jQ(document).ready(function () {
	var templateURL = jQ('#template-url').val(),
	jQAjax = function(data, div, url) {
        jQ.ajax({
            url: templateURL + url,
            data: data,
            type: 'post',
            beforeSend: function(){
                jQ('.datatable').addClass('overlay');
            },
            success: function(data) {
                jQ('.' + div).removeClass('overlay');
                jQ( ".page-container" ).html(data);
            },
            error: function(errorThrown){
                jQ('.' + div).removeClass('overlay');
                console.log(errorThrown);
            }
        });
    },
	onClickVendorSetup = jQ('#vendor_setup').click(function () {
		var data = {};
		jQ('li').removeClass('active');
		jQ(this).parent().addClass('active');
		jQAjax(data, "page-container", "/googleDetails.php");
	}),
	onClickHome = jQ('#home').click(function () {
		jQ('li').removeClass('active');
		jQ(this).parent().addClass('active');
		jQ( ".page-container" ).html('');
	});
});
