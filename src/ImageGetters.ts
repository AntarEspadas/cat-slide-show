
export class CatApiGetter implements ImageGetter {

    private static apiUrl: string = "https://api.thecatapi.com/v1/images/search"

    private static types: { [imgType: string]: string } = {
        "gif": "gif",
        "static": "jpg,png",
        "both": "jpg,png,gif"
    }

    private _options: CatGetterOptions = { imgType: "both" }

    constructor() {

    }

    get = async () => {
        const mimeTypes = CatApiGetter.types[this._options.imgType]
        let response = await fetch(CatApiGetter.apiUrl + "?mime_types=" + mimeTypes)
        let json = await response.json()
        return json[0].url
    }


    public get options(): CatGetterOptions {
        return this._options
    }


    public set options(v: CatGetterOptions) {
        this._options = v;
    }


}

export class CataasGetter implements ImageGetter {
    static apiUrl: string = "https://cataas.com"

    private _options: CatGetterOptions = { imgType: "both" }

    get = async () => {
        let response = await fetch(CataasGetter.apiUrl + "/cat" + (this._options.imgType == "gif" ? "/gif" : "") + "?json=true")
        let json = await response.json()
        return CataasGetter.apiUrl + json.url
    }

    public get options(): CatGetterOptions {
        return this._options
    }


    public set options(v: CatGetterOptions) {
        this._options = v;
    }
}

export class DanbooruImageGetter implements ImageGetter {

    public async get(): Promise<string> {
        const page = Math.floor(Math.random() * 1000 + 1)
        const url = `https://danbooru.donmai.us/post/index.json?limit=200&page=${page}&tags=rating:s`
        const response = await fetch(url)
        const json = await response.json() as DanbooruPost[]
        const extensions = ["gif", "png", "jpg"]
        let post: DanbooruPost
        while (true) {
            let postIndex = Math.floor(Math.random() * 200)
            post = json[postIndex]
            if (!post.file_url) continue
            let extension = post.file_url.substring(post.file_url.length - 3).toLowerCase()
            if (!extensions.find(element => element == extension)) continue
            break
        }
        return post.file_url
    }

    public get options(): {} {
        return {}
    }

    public set options(value: {}) {
    }
}

interface DanbooruPost {
    file_url?: string
}

export interface ImageGetter {
    get: () => Promise<string>,
    options: object
}

export interface CatGetterOptions {
    imgType: ImgType
}

type ImgType = "static" | "gif" | "both"