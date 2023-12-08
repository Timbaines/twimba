// IMPORT tweetsData ARRAY FROM DATA.JS TO SCRIPT.JS
import { tweetsData } from '/js/data.js'

// IMPORTS RANDOM GENERATED UUID FOR POSTING A TWEET
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';
console.log(uuidv4());


// EVENT LISTENER USING IF/ELSE STATEMENT TO LISTEN FOR A 'CLICK' ON EITHER THE COMMENT, LIKE OR RETWEET ICON
document.addEventListener('click', function(e) {
    if(e.target.dataset.like){
        handleLikeClick(e.target.dataset.like)
    }
    else if(e.target.dataset.retweet) {
        handleRetweetClick(e.target.dataset.retweet)
    }
    else if(e.target.dataset.reply) {
        handleReplyClick(e.target.dataset.reply)
    }
    else if(e.target.id === 'tweet-btn'){
        handleTweetBtnClick()
    }
})

// LIKE FUNCTION
function handleLikeClick(tweetId) {
    // 1. Iterate over tweetsData and use the uuid saved in tweetId to identify the liked tweet's object.
    // 2. Saves the object into the new const of targetTweetOnj
    const targetTweetObj = tweetsData.filter(function (tweet) {
        return tweet.uuid === tweetId
    })[0] //ACCESS SINGLE OBJECT FROM THE ARRAY
    // Increments the "like" icon when clicked
    if (targetTweetObj.isLiked) {
        targetTweetObj.likes--
    }
    // Decrements the "like" icon when clicked
    else {
        targetTweetObj.likes ++
    }
    // Logical Not Operator to flip boolean
    targetTweetObj.isLiked = !targetTweetObj.isLiked

    render()
}

// RETWEET FUNCTION
function handleRetweetClick(tweetId) {
    const targetRetweetedObj = tweetsData.filter(function (tweet) {
        return tweet.uuid === tweetId
    })[0] //ACCESS SINGLE OBJECT FROM THE ARRAY
    if (targetRetweetedObj.isRetweeted) {
        targetRetweetedObj.retweets--
    }
    else {
        targetRetweetedObj.retweets++
    }
    targetRetweetedObj.isRetweeted =!targetRetweetedObj.isRetweeted

    render()
}

// REPLY FUNCTION
function handleReplyClick(replyId){
    document.getElementById(`replies-${replyId}`).classList.toggle('hidden')
}

// NEW TWEET FUNCTION
function handleTweetBtnClick() {
    const tweetInput = document.getElementById('tweet-input')

    if(tweetInput.value) {
        tweetsData.unshift({
            handle: `@Scrimba`,
            profilePic: `images/scrimbalogo.png`,
            likes: 0,
            retweets: 0,
            tweetText: tweetInput.value,
            replies: [],
            isLiked: false,
            isRetweeted: false,
            uuid: uuidv4()
        })

        render()
        tweetInput.value = ``
    }
}

// FUNCTION RENDERING DOM ELEMENTS TO THE PAGE
function getFeedHtml(){
    let feedHtml = ``
    tweetsData.forEach(function(tweet){

        let likeIconClass = ``

        if(tweet.isLiked) {
            likeIconClass = 'liked'
        }

        let reTweetIconClass = ``

        if(tweet.isRetweeted) {
            reTweetIconClass = 'retweeted'
        }

        let repliesHtml = ``

        if(tweet.replies.length > 0) {
            tweet.replies.forEach(function(reply) {
                repliesHtml+= `
                <div class="tweet-reply">
                    <div class="tweet-inner">
                        <img src="${reply.profilePic}" class="profile-pic" alt="profile image">
                        <div>
                            <p class="handle">${reply.handle}</p>
                            <p class="tweet-text">${reply.tweetText}T</p>
                        </div>
                    </div>
                </div>
                `
            })
        }

         feedHtml += `
            <div class="tweet">
                <div class="tweet-inner">
                    <img src="${tweet.profilePic}" class="profile-pic" alt="profile image">
                    <div>
                        <p class="handle">${tweet.handle}</p>
                        <p class="tweet-text">${tweet.tweetText}</p>
                        <div class="tweet-details">
                            <span class="tweet-detail">
                            <i class="fa-regular fa-comment-dots" data-reply="${tweet.uuid}"></i> 
                                ${tweet.replies.length}
                            </span>
                            <span class="tweet-detail">
                            <i class="fa-solid fa-heart ${likeIconClass}"  data-like="${tweet.uuid}"></i>
                                ${tweet.likes}
                            </span>
                            <span class="tweet-detail">
                            <i class="fa-solid fa-retweet ${reTweetIconClass}"  data-retweet="${tweet.uuid}"></i>
                                ${tweet.retweets}
                            </span>
                        </div>   
                    </div>            
                </div>
                <div class="hidden" id="replies-${tweet.uuid}">
                    ${repliesHtml}
                </div>
            </div>
            `
    })
    return feedHtml
}

// RENDERS TWEETS FROM DATA.JS
function render() {
    document.getElementById('feed').innerHTML = getFeedHtml()
}

render()
