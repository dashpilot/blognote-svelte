<script>
  import Posts from './components/Posts.svelte';
	import AddPost from './components/AddPost.svelte';
	import Categories from './components/Categories.svelte';
  import Firebase from './components/Firebase.svelte';

	let data = {};
	data.entries = [{
	    id: '3KvB5k89',
	    title: 'Welcome to BlogNote!',
	    body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
	    category: 'default'
	  }
	];

	data.categories = [{
	    name: 'default',
	    slug: 'default'
	  }
	];

	let current = data.entries[0].id;


</script>



<main>

<div class="row no-gutters">
<div class="col-md-2" id="side">




<Categories bind:data={data} />

</div>


<div class="col-md-10">

<nav>
<div class="row">
<div class="col-md-6">
<AddPost bind:data={data} />
</div>
<div class="col-md-6 text-right">
<Firebase bind:data={data} />
</div>
</div>
</nav>




<Posts bind:data={data} bind:current={current} />
</div>


</div>


</main>



<style>

</style>
