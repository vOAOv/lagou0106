function PositionList(container) {
	this.container = container;
	this.page = 1;
	this.size = 10;
	this.init();
}

PositionList.Temp = `
	<table class="table" style="margin-top:20px;">
		<thead>
			<tr>
				<th>序号</th>
				<th>姓名</th>
				<th>性别</th>
				<th>期望薪资</th>
				<th>学历</th>
				<th>Logo</th>
				<th>操作</th>
			</tr>
		</thead>
		<tbody class="js-tbody"></tbody>
	</table>
`;

PositionList.Suit = `
	<div class="modal fade js-suitpos-modal" role="dialog" aria-labelledby="SuitPositionLabel">
	  <div class="modal-dialog" role="document">
	    <div class="modal-content">
	      <div class="modal-header">
	        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
	        <h4 class="modal-title" id="AddPositionLabel">合适的职位</h4>
	      </div>
	      <div class="modal-body">
			<table class="table" style="margin-top:20px;">
				<thead>
					<tr>
						<th>序号</th>
						<th>公司</th>
						<th>职位</th>
						<th>薪资</th>
						<th>地址</th>
						<th>Logo</th>
						<th>操作</th>
					</tr>
				</thead>
				<tbody class="js-suit-tbody"></tbody>
			</table>
	      </div>
	      <div class="modal-footer">
	       
	      </div>
	    </div>
	  </div>
	</div>
`;


$.extend(PositionList.prototype, {
	init: function() {
		this.createDom();
		this.getListInfo();
		this.bindEvents();
		this.createUpdatePosition();
	},
	createDom: function() {
		this.element = $(PositionList.Temp);
		this.container.append(this.element);
		this.SuitPosition = $(PositionList.Suit);
		this.container.append(this.SuitPosition)
	},
	createUpdatePosition: function() {
		this.updatePosition = new UpdatePosition(this.container);
		$(this.updatePosition).on("change", $.proxy(this.getListInfo, this));
	},
	bindEvents: function() {
		this.container.on("click", $.proxy(this.handleTableClick, this));
	},
	handleTableClick: function(e) {
		var target = $(e.target),
			isDeleteClick = target.hasClass("js-delete"),
			isUpdateClick = target.hasClass("js-update"),
			isSalaryClick = target.hasClass("js-salary");
		if (isDeleteClick) {
			this.deleteItem(target.attr("data-id"), target.attr("data-file"));
		}
		if (isUpdateClick) {
			this.updatePosition.showItem(target.attr("data-id"), target.attr("data-file"));
		}
		if (isSalaryClick) {
			this.showSuit(target.attr("data-salary"));
		}
	},
	showSuit: function(salary) {
		$.ajax({
			url: "/api/salarySuit",
			data:{
				salary: salary
			},
			success: $.proxy(this.handleShowSuitSucc, this)
		})
	},
	handleShowSuitSucc: function(res) {
		if(res && res.data && res.data.suit) {
			var suitposition = res.data.suit,
				str = "",
				suitContainer = this.SuitPosition.find(".js-suit-tbody");
			for(var i = 0; i < suitposition.length; i++){
				var	item = suitposition[i],
					file = item.filename ? item.filename : "1515208552291Image.png";
					str += `
						<tr>
							<td>${i + 1}</td>
							<td>${item.company}</td>
							<td>${item.position}</td>
							<td>${item.salary}</td>
							<td>${item.address}</td>
							<td><img style="width:30px;height:30px;" src="/uploads/${file}"/></td>
							<td style="cursor:pointer;color:red">查看详情</td>
						</tr>
					`;
				}
			suitContainer.html(str)		
		}
	},
	deleteItem: function(id, file) {
		$.ajax({
			url: "/api/removePositionReady",
			data: {
				id: id,
				file: file
			},
			success: $.proxy(this.handleItemDeleteSucc, this)
		})
	},
	handleItemDeleteSucc: function(res) {
		if (res && res.data && res.data.delete) {
			this.getListInfo();
		}
	},
	getListInfo: function() {
		$.ajax({
			url: "/api/getPositionListReady",
			data: {
				page: this.page,
				size: this.size
			},
			success: $.proxy(this.handleGetListInfoSucc, this)
		})
	},
	handleGetListInfoSucc: function(res) {
		if (res && res.data && res.data.list.length !== 0) {
			this.createItems(res.data.list);
			if (this.page > res.data.totalPage) {
				this.page = res.data.totalPage;
				this.getListInfo();
			}else {
				$(this).trigger(new $.Event("change", {
					total: res.data.totalPage
				}))
			}			
		}else {
			var itemContainer = this.element.find(".js-tbody");
			itemContainer.html("");
			$(this).trigger(new $.Event("change", {
				total: 0
			}))
		}
	},
	createItems: function(list) {
		var itemContainer = this.element.find(".js-tbody"),
			str = "";
			for(var i = 0; i < list.length; i++){
				var item = list[i],			
					file = item.filename ? item.filename : "1515208552291Image.png";
				str += `
					<tr>
						<td>${i + 1}</td>
						<td>${item.name}</td>
						<td>${item.sex}</td>
						<td>
							<button style="width:76px;height:34px;" data-salary="${item.salary}" type="button" class="btn btn-info js-salary" data-toggle='modal' data-target='.js-suitpos-modal'>${item.salary}
							</button>	
						</td>
						<td>${item.level}</td>
						<td><img style="width:30px;height:30px;" src="/uploads/${file}"/></td>
						<td>
							<span style="cursor:pointer" class="js-update" data-file="${file}" data-id="${item._id}">修改</span>
							<span style="cursor:pointer" class="js-delete" data-file="${file}" data-id="${item._id}">删除</span>
						</td>
					</tr>
				`;
			}
		itemContainer.html(str);	
	},
	changePage: function(page) {
		this.page = page;
		this.getListInfo();
	}
})