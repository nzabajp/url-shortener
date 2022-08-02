const burger = document.getElementById("burger-menu")
const navMenu = document.getElementById("nav-menu")
const shortenBtn = document.getElementById("short-btn")
const urlInput = document.getElementById("url-input")
const resultsContainer = document.getElementById("results-container")
const errorText = document.getElementById("error-text")

//fetch function
async function getShortUrl(url) {
    try {
        const res = await fetch(`https://api.shrtco.de/v2/shorten?url=${url}`)
        if (!res.ok) {
            throw new Error(res.status)
        }
        const data = await res.json()
        toLocalStorage(data)
    }
    catch(err) {
        console.error(err)
        errorText.textContent = "Please add a valid link"
        urlInput.classList.add("no-link-error")
    }
}

//adds data to localStorage
function toLocalStorage(obj) {
    const {ok, result: {full_short_link, original_link}} = obj
    if(ok) {
        const newData = {
            shortLink: full_short_link,
            originalLink: original_link
        }
        let localData = JSON.parse(localStorage.getItem("shortly"))
        if(localData) {
            localData.unshift(newData)
            localStorage.setItem("shortly", JSON.stringify(localData))
        } else {
            localData = [newData]
            localStorage.setItem("shortly", JSON.stringify(localData))
        }
    }
}


//fetches data from localStorage and renders it to the DOM
function render() {
    const renderHtml = JSON.parse(localStorage.getItem("shortly"))
    if(renderHtml) {
        resultsContainer.innerHTML = renderHtml.map((data, index) => {
            const {shortLink, originalLink} = data
            return `
                <div class="results-field">
                    <p class="results-long-url">${originalLink}</p>
                    <hr />
                    <p class="results-long-short">${shortLink}</p>
                    <button id="${index}" class="result-copy-btn" onclick="copy('${shortLink}', '${index}')">Copy</button>
                </div>`
        }).join("")
    }
}


//copies link from DOM and saves it to clipboard
function copy(url, id) {
    navigator.clipboard.writeText(url)
        .then(() => {
            //successful
            document.getElementById(id).classList.add("copied-button")
            document.getElementById(id).textContent = "Copied!"
        }, () => {
            //failed
            console.error("An error has occured")
        })
}


render()

burger.addEventListener("click", () => {
    navMenu.classList.toggle("nav-open")
})

urlInput.addEventListener("focusin", () => {
    urlInput.select()
    errorText.textContent = ""
    urlInput.classList.remove("no-link-error")
})

shortenBtn.addEventListener("click", () => {
    getShortUrl(urlInput.value)
        .then(data => render())
})


