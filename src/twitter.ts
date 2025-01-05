import { TwitterApi } from 'twitter-api-v2';
import Sentiment from 'sentiment';

const twitterClient = new TwitterApi('YOUR_TWITTER_API_KEY');
const sentimentAnalyzer = new Sentiment();

// Fetch tweets
async function fetchTweets(query: string) {
    const { data } = await twitterClient.v2.search(query, { max_results: 10 });
    data.forEach(tweet => {
        const sentiment = sentimentAnalyzer.analyze(tweet.text);
        console.log(`Tweet: ${tweet.text}`);
        console.log(`Sentiment Score: ${sentiment.score}`);
    });
}

// Example usage
fetchTweets('#DeFi');
