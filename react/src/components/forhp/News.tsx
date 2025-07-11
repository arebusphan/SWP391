import { useEffect, useState } from "react";
import { getHealthNews } from "../../service/serviceauth";

type NewsSource = {
    id: string | null;
    name: string;
};

type NewsItem = {
    source: NewsSource;
    author: string | null;
    title: string;
    description: string | null;
    url: string;
    urlToImage: string | null;
    publishedAt: string;
    content: string | null;
};

const News = () => {
    const [news, setNews] = useState<NewsItem[]>([]);

    useEffect(() => {
        getHealthNews()
            .then(res => {
                setNews(res.data.articles.slice(0, 8));
            })
            .catch(error => {
                console.error("Error fetching news:", error.response?.data || error.message);
            });
    }, []);

    return (
        <div className="flex flex-wrap justify-center gap-8 w-full h-full">
            {news.map((data, index) => (
                <a
                    key={index}
                    href={data.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block max-w-sm rounded overflow-hidden shadow-lg hover:shadow-xl transition bg-white"
                >
                    <img
                        className="w-full h-[30vh] object-cover"
                        src={data.urlToImage || "/img/card-top.jpg"}
                        alt={data.title || "News Image"}
                    />
                    <div className="px-6 py-4">
                        <div className="font-bold text-xl mb-2">
                            {data.title || "No Title"}
                        </div>
                        <p className="text-gray-700 text-base">
                            {data.description || "No description available."}
                        </p>
                    </div>
                    <div className="px-6 pt-4 pb-2">
                        <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                            #{data.source?.name || "source"}
                        </span>
                    </div>
                </a>
            ))}
        </div>
    );
};

export default News;
