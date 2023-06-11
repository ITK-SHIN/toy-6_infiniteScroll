;(function () {
  'use strict'

  const get = (target) => {
    return document.querySelector(target)
  }

  let page = 1
  const limit = 10
  const $posts = get('.posts')
  const end = 100 //데이터의 총 갯수
  let total = 10 // 여태까지 불러온 데이터의 개수를 나타낸다.

  const $loader = get('.loader')

  const getPost = async () => {
    const API_URL = `https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=${limit}`
    const response = await fetch(API_URL)
    if (!response.ok) {
      //ok이가 아닌경우
      throw new Error('에러발생')
    }
    //ok이인 경우
    return await response.json()
  }

  const showPosts = (posts) => {
    posts.forEach((post) => {
      const $post = document.createElement('div')
      $post.classList.add('post')
      $post.innerHTML = `
        <div class="header>
          <div class="id">${post.id}</div>
          <div class="title">${post.title}</div>
        </div>
        <div class="body">
          ${post.body}
        </div>
      `
      $posts.appendChild($post)
    })
  }

  const hideLoader = () => {
    $loader.classList.remove('show')
  }

  const showLoader = () => {
    $loader.classList.add('show')
  }

  const loadPost = async () => {
    // 로딩 엘리먼트를 보여줌
    showLoader()
    try {
      const response = await getPost()
      showPosts(response)
    } catch (error) {
      console.error(error)
    } finally {
      //로딩 엘리먼트를 사라지게 함
      hideLoader()
    }
  }

  const onScroll = () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement

    if (total === end) {
      window.removeEventListener('scroll', onScroll)

      return
    }
    if (scrollTop + clientHeight >= scrollHeight - 5) {
      page++
      total += 10
      loadPost()
    }
  }

  window.addEventListener('DOMContentLoaded', () => {
    loadPost()

    window.addEventListener('scroll', onScroll)
  })
})()
