function AddPosition(container) {
	this.container = container;
	this.init();
}

AddPosition.BtnTempReady = `
	<button type="button" class="btn btn-info" data-toggle='modal' data-target='.js-addpos-modal'>增加</button>
`;
AddPosition.ModelTempReady = `
	<div class="modal fade js-addpos-modal" role="dialog" aria-labelledby="AddPositionLabel">
	  <div class="modal-dialog" role="document">
	    <div class="modal-content">
	      <div class="modal-header">
	        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
	        <h4 class="modal-title" id="AddPositionLabel">新增职位</h4>
	      </div>
	      <div class="modal-body">
			<div class="form-group">
			  <label for="addpos-name">姓名</label>
			  <input type="text" class="form-control js-name" id="addpos-name" placeholder="请输入姓名">
			</div>
			<div class="form-group">
			  <label for="addpos-sex">性别</label>
			   <select class="form-control js-sex" id="addpos-sex">
			  	  <option>男</option>
				  <option>女</option>
			   </select>
			</div>
			<div class="form-group">
			  <label for="addpos-salary">期望薪资</label>
			  <select class="form-control js-salary" id="addpos-salary">
				  <option>5k-10k</option>
				  <option>10k-20k</option>
				  <option>20k-25k</option>
				  <option>25k-35k</option>
				  <option>35k+</option>
				</select>
			</div>
			<div class="form-group">
			  <label for="addpos-level">学历</label>
			  <select class="form-control js-level" id="addpos-level">
				  <option>本科</option>
				  <option>专科</option>
				  <option>研究生</option>
				  <option>博士</option>
				  <option>幼儿园</option>
			  </select>
			</div>
			<div class="form-group">
			  <label for="addpos-logo">头像</label>
			  <input type="file" class="form-control js-logo" id="addpos-logo">
			</div>
	      </div>
	      <div class="modal-footer">
	        <button type="button" class="btn btn-primary js-submit">提交</button>
	      </div>
	      <div class="alert alert-success hide js-succ-notice" role="alert" style="margin:20px;">
			添加成功
	      </div>
	      <div class="alert alert-danger hide js-err-notice" role="alert" style="margin:20px;">
			对不起,添加失败！
	      </div>
	    </div>
	  </div>
	</div>
`;

$.extend(AddPosition.prototype, {
	init: function() {
		this.createDom();
		this.bindEvents();
	},
	createDom: function() {
		this.btn = $(AddPosition.BtnTempReady);
		this.modal = $(AddPosition.ModelTempReady);
		this.succNoticeElem = this.modal.find(".js-succ-notice");
		this.container.append(this.btn);
		this.container.append(this.modal);
	},
	bindEvents: function() {
		var submitBtn = this.modal.find(".js-submit");
		submitBtn.on("click", $.proxy(this.handleSubmitBtnClick, this));
	},
	handleSubmitBtnClick: function() {
		var name = this.modal.find(".js-name").val(),
			sex = this.modal.find(".js-sex").val(),
			salary = this.modal.find(".js-salary").val(),
			level = this.modal.find(".js-level").val();
			logo = this.modal.find(".js-logo")[0].files[0];

		var formData = new FormData();//浏览器自带的类  表单数据
		formData.append("name", name);
		formData.append("sex", sex);
		formData.append("salary", salary);
		formData.append("level", level);
		formData.append("logo", logo);	

		$.ajax({
			cache: false,		
			type: "POST",
			url: "/api/addPositionReady",
			processData: false,
			contentType: false,
			data: formData,
			success: $.proxy(this.handleAddPositionSucc, this)
		})	
	},
	handleAddPositionSucc: function(res) {
		if (res && res.data && res.data.inserted) {
			this.succNoticeElem.removeClass("hide");
			setTimeout($.proxy(this.handleDelay, this), 2000);
			$(this).trigger("change");
		}
	},
	handleDelay: function() {
		this.succNoticeElem.addClass("hide");
		this.modal.modal("hide");
		var name = this.modal.find(".js-name").val(""),
			sex = this.modal.find(".js-sex").val(""),
			level = this.modal.find(".js-level").val("")
			logo = this.modal.find(".js-logo").val("");
	}
})