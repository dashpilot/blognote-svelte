<script>
//import { onMount } from 'svelte';


  import Posts from './components/Posts.svelte';
	import AddPost from './components/AddPost.svelte';
	import Categories from './components/Categories.svelte';
  import Firebase from './components/Firebase/Firebase.svelte';

	let data = {};
	data.entries = [{
	    id: '3KvB5k89',
	    title: 'Welcome to BlogNote!',
	    body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
	    category: 'default',
      image: '',
      meta: []
	  }
	];

	data.categories = [{
	    name: 'default',
	    slug: 'default',
      fields: []
	  }
	];

	let current = false;



</script>



<main>

<div class="row no-gutters">
<div class="col-md-2" id="side">

  <Categories bind:data={data} />


</div>

<div class="col-md-10">

  <nav class="nopad">
  <div class="row no-gutters"><div class="col-md-3" id="postnav-left"><div class="pad"><h6>Notes</h6><AddPost bind:data={data} bind:current={current}/></div></div>
  <div class="col-md-9"><div class="pad"><Firebase bind:data={data} bind:current={current} /></div></div>
  </div>

  </nav>
  <Posts bind:data={data} bind:current={current} />

</div>

</div>



</main>



<style>

#side{
	background-color: #252A3A;
	color: white;

}

</style>
