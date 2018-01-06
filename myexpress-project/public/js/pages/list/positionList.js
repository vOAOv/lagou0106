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
				<th>公司</th>
				<th>职位</th>
				<th>薪资</th>
				<th>地址</th>
				<th>Logo</th>
				<th>操作</th>
			</tr>
		</thead>
		<tbody class="js-tbody"></tbody>
	</table>
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
			isUpdateClick = target.hasClass("js-update");
		if (isDeleteClick) {
			this.deleteItem(target.attr("data-id"), target.attr("data-file"));
		}
		if (isUpdateClick) {
			this.updatePosition.showItem(target.attr("data-id"), target.attr("data-file"));
		}
	},
	deleteItem: function(id, file) {
		$.ajax({
			url: "/api/removePosition",
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
			url: "/api/getPositionList",
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
						<td>${item.company}</td>
						<td>${item.position}</td>
						<td>${item.salary}</td>
						<td>${item.address}</td>
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