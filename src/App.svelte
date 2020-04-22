<script>
  import Posts from './components/Posts.svelte';
	import AddPost from './components/AddPost.svelte';
	import Categories from './components/Categories.svelte';

	let data = {};
	data.entries = [{
	    id: '3KvB5k89',
	    title: 'Hello there',
	    body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
	    category: 'default'
	  },
	  {
	    id: '4Kf79Op',
	    title: 'Second article',
	    body: 'Sed a consectetur urna. Nulla sollicitudin pulvinar leo nec ultricies.',
	    category: 'default'
	  },
	  {
	    id: '5gHRc9i',
	    title: 'Third article',
	    body: 'Vestibulum diam massa, fermentum vel suscipit eget, rhoncus vitae metus.',
	    category: 'ideas'
	  }
	];

	data.categories = [{
	    name: 'default',
	    slug: 'default'
	  },
	  {
	    name: 'ideas',
	    slug: 'ideas'
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
<button class="btn btn-outline-dark">Publish</button>
</div>
</div>
</nav>




<Posts bind:data={data} bind:current={current} />
</div>


</div>


</main>



<style>

</style>
