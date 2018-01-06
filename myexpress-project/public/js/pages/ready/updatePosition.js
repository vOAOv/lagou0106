function UpdatePosition(container) {
	this.container = container;
	this.id = "";
	this.init();
}

UpdatePosition.ModelTempReady =  `
	<div class="modal fade js-updatepos-modal" role="dialog" aria-labelledby="UpdatePositionLabel">
	  <div class="modal-dialog" role="document">
	    <div class="modal-content">
	      <div class="modal-header">
	        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
	        <h4 class="modal-title" id="UpdatePositionLabel">新增职位</h4>
	      </div>
	      <div class="modal-body">
			<div class="form-group">
			  <label for="addpos-name">姓名</label>
			  <input type="text" class="form-control js-name" id="updatepos-name" placeholder="请输入姓名">
			</div>
			<div class="form-group">
			  <label for="addpos-sex">性别</label>
			   <select class="form-control js-sex" id="updatepos-sex">
			  	  <option>男</option>
				  <option>女</option>
			   </select>
			</div>
			<div class="form-group">
			  <label for="addpos-salary">期望薪资</label>
			  <select class="form-control js-salary" id="updatepos-salary">
				  <option>5k-10k</option>
				  <option>10k-20k</option>
				  <option>20k-25k</option>
				  <option>25k-35k</option>
				  <option>35k+</option>
				</select>
			</div>
			<div class="form-group">
			  <label for="addpos-level">学历</label>
			  <select class="form-control js-level" id="updatepos-level">
				  <option>本科</option>
				  <option>专科</option>
				  <option>研究生</option>
				  <option>博士</option>
				  <option>幼儿园</option>
			  </select>
			</div>
			<div class="form-group">
			  <label for="addpos-logo">头像</label>
			  <input type="file" class="form-control js-logo" id="updatepos-logo">
			</div>
	      </div>
	      <div class="modal-footer">
	        <button type="button" class="btn btn-primary js-submit">提交</button>
	      </div>
	      <div class="alert alert-success hide js-succ-notice" role="alert" style="margin:20px;">
			修改成功
	      </div>
	      <div class="alert alert-danger hide js-err-notice" role="alert" style="margin:20px;">
			对不起,修改失败！
	      </div>
	    </div>
	  </div>
	</div>
`;

$.extend(UpdatePosition.prototype, {
	init: function() {
		this.createDom();
		this.bindEvents();
	},
	createDom: function() {
		this.element = $(UpdatePosition.ModelTempReady);
		this.nameElem = this.element.find(".js-name");
		this.sexElem = this.element.find(".js-sex");
		this.salaryElem = this.element.find(".js-salary");
		this.levelElem = this.element.find(".js-level");
		this.logoElem = this.element.find(".js-logo");
		this.succNoticeElem = this.element.find(".js-succ-notice");
		this.container.append(this.element);
	},
	showItem: function(id, file) {
		this.element.modal("show");
		this.getPositionInfo(id, file);
	},
	getPositionInfo: function(id, oldfilename) {
		$.ajax({
			url: "/api/getPositionReady",
			data: {
				id: id,
				oldfilename: oldfilename
			},
			success: $.proxy(this.handleGetPositionInfoSucc, this)
		})
	},
	handleGetPositionInfoSucc: function(res) {
		if (res && res.data && res.data.info) {
			var info = res.data.info;
			this.nameElem.val(info.name);
			this.sexElem.val(info.sex);
			this.salaryElem.val(info.salary);
			this.levelElem.val(info.level);
			this.id = info._id;
		}
	},
	bindEvents: function() {
		var submitBtn = this.element.find(".js-submit");
		submitBtn.on("click", $.proxy(this.handleSubmitBtnClick, this));
	},
	handleSubmitBtnClick: function() {
		var name = this.nameElem.val(),
			sex = this.sexElem.val(),
			salary = this.salaryElem.val(),
			level = this.levelElem.val(),
			logo = this.logoElem[0].files[0];

		var formData = new FormData();

		formData.append("name", name);
		formData.append("sex", sex);
		formData.append("salary", salary);
		formData.append("level", level);
		formData.append("id", this.id);
		formData.append("logo", logo);

		$.ajax({
			type: "POST",
			url: "/api/updatePositionReady",
			cache: false,
			processData: false,
			contentType: false,
			data: formData,
			success: $.proxy(this.handleUpdatePositionSucc, this)
		})
	},
	handleUpdatePositionSucc: function(res) {
		if (res && res.data && res.data.update) {
			this.succNoticeElem.removeClass("hide");
			setTimeout($.proxy(this.handleDelay, this), 2000);
			$(this).trigger("change");
		}
	},
	handleDelay: function() {
		this.succNoticeElem.addClass("hide");
		this.element.modal("hide");
	}
})