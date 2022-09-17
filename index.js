const url = 'https://jsonplaceholder.typicode.com/todos'
const url_users = 'https://jsonplaceholder.typicode.com/users'
let keyword = ''
let data = []
let dataUsers = []
let start = 0
let page = 1
let limit = 0

const limitValue = () => {
    const select = document.getElementById('page')
    const option = select.options[select.selectedIndex]
    if(option){
        limit = parseInt(option.value)
        renderData(data)
    }else{
        limit = 10
    }
}

const getUserInfo = async (datas) => {
    try {
		const userIds = datas.map((todo) =>
			fetch(`${url_users}/${todo.userId}`)
		);
		const result = await Promise.all(userIds);
		const results = result.map((res) => res.json());
		const users = await Promise.all(results);
		datas = datas.map((data, index) => ({ ...data, ...users[index] }));
		return datas;
	} catch (err) {
		console.error(err);
	}
}

const getDataAPI = async () => {
    try {
        const response = await axios.get(url)
        data = response.data
        renderData(data)
    } catch (err) {
        console.error(err)
    }
}

const resetPage = () => {
    page = 1
    start = 0
    limit = 10
    renderData(data)
}

const handleSearch = () => {
    let input = document.getElementById("search")
    keyword = input.value.toLowerCase()
    renderData(data)
}

const handleNext = () => {
    if(start >= 0 && start < totalData){
        page += 1
        start = (page * limit - 10)
    }
    renderData(data)
}

const handlePrev = () => {
    if (page !== 1) {
        page -= 1
        start = (page * limit) - 10
    }
    renderData(data)
}
const renderData = async (data) => {
    totalData = data.length - 10
    const filter = data.filter(item => {
        if(item.title.toLowerCase().includes( keyword)) return item
    })
    const offset = filter.slice(start, page * limit - 1)
    dataToRender = await getUserInfo(offset)
    getUserInfo(offset)
    const viewData = dataToRender.map((value) => (
        `
            <div class="card grid leading-[30px] hover:bg-gray-50 shadow border rounded-xl p-6">
                
                <p class="mb-3 font-light ${value.completed ? 'text-green-500' : 'text-red-500'}"> ${value.completed ? 'Completed' : 'Not Complete'} </p>
                
                <div class="mt-3 text-sm">
					<p>Author: ${value.name}</p>
					<p>Email: ${value.email}</p>
					<p>Phone: ${value.phone}</p>
				</div>

                <h1 class="card-title mt-5 font-bold mb-4 h-[40px] !leading-[24px] capitalize">
                    ${value.title}
                </h1>
            </div>
            `
    )
    ).join("")
    document.getElementById('data').innerHTML = viewData
    document.getElementById('number').innerHTML = page
}
limitValue()
getDataAPI()