
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.head.appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        if (value != null || input.value) {
            input.value = value;
        }
    }
    function select_option(select, value) {
        for (let i = 0; i < select.options.length; i += 1) {
            const option = select.options[i];
            if (option.__value === value) {
                option.selected = true;
                return;
            }
        }
    }
    function select_value(select) {
        const selected_option = select.querySelector(':checked') || select.options[0];
        return selected_option && selected_option.__value;
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
    }
    function flush() {
        const seen_callbacks = new Set();
        do {
            // first, call beforeUpdate functions
            // and update components
            while (dirty_components.length) {
                const component = dirty_components.shift();
                set_current_component(component);
                update(component.$$);
            }
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    callback();
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    function bind(component, name, callback) {
        const index = component.$$.props[name];
        if (index !== undefined) {
            component.$$.bound[index] = callback;
            callback(component.$$.ctx[index]);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const prop_values = options.props || {};
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, prop_values, (i, ret, value = ret) => {
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if ($$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(children(options.target));
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set() {
            // overridden by instance, if it has props
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, detail));
    }
    function append_dev(target, node) {
        dispatch_dev("SvelteDOMInsert", { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev("SvelteDOMInsert", { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev("SvelteDOMRemove", { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ["capture"] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev("SvelteDOMAddEventListener", { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev("SvelteDOMRemoveEventListener", { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev("SvelteDOMRemoveAttribute", { node, attribute });
        else
            dispatch_dev("SvelteDOMSetAttribute", { node, attribute, value });
    }
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev("SvelteDOMSetProperty", { node, property, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.data === data)
            return;
        dispatch_dev("SvelteDOMSetData", { node: text, data });
        text.data = data;
    }
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error(`'target' is a required option`);
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn(`Component was already destroyed`); // eslint-disable-line no-console
            };
        }
    }

    /* src/components/Posts.svelte generated by Svelte v3.16.7 */

    const file = "src/components/Posts.svelte";

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[9] = list[i];
    	return child_ctx;
    }

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[6] = list[i];
    	child_ctx[7] = list;
    	child_ctx[8] = i;
    	return child_ctx;
    }

    function get_each_context_2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[6] = list[i];
    	return child_ctx;
    }

    // (22:0) {#each data.entries as item }
    function create_each_block_2(ctx) {
    	let div;
    	let t0_value = /*item*/ ctx[6].title + "";
    	let t0;
    	let t1;
    	let div_data_category_value;
    	let dispose;

    	function click_handler(...args) {
    		return /*click_handler*/ ctx[3](/*item*/ ctx[6], ...args);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			t0 = text(t0_value);
    			t1 = space();
    			attr_dev(div, "class", "item");
    			attr_dev(div, "data-category", div_data_category_value = /*item*/ ctx[6].category);
    			toggle_class(div, "active", /*current*/ ctx[1] === /*item*/ ctx[6].id);
    			add_location(div, file, 22, 0, 181);

    			dispose = [
    				listen_dev(
    					div,
    					"click",
    					function () {
    						if (is_function(/*setEntry*/ ctx[2](/*item*/ ctx[6]))) /*setEntry*/ ctx[2](/*item*/ ctx[6]).apply(this, arguments);
    					},
    					false,
    					false,
    					false
    				),
    				listen_dev(div, "click", click_handler, false, false, false)
    			];
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t0);
    			append_dev(div, t1);
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*data*/ 1 && t0_value !== (t0_value = /*item*/ ctx[6].title + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*data*/ 1 && div_data_category_value !== (div_data_category_value = /*item*/ ctx[6].category)) {
    				attr_dev(div, "data-category", div_data_category_value);
    			}

    			if (dirty & /*current, data*/ 3) {
    				toggle_class(div, "active", /*current*/ ctx[1] === /*item*/ ctx[6].id);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2.name,
    		type: "each",
    		source: "(22:0) {#each data.entries as item }",
    		ctx
    	});

    	return block;
    }

    // (33:2) {#if current==item.id}
    function create_if_block(ctx) {
    	let input;
    	let t0;
    	let select;
    	let t1;
    	let textarea;
    	let textarea_value_value;
    	let dispose;

    	function input_input_handler() {
    		/*input_input_handler*/ ctx[4].call(input, /*item*/ ctx[6]);
    	}

    	let each_value_1 = /*data*/ ctx[0].categories;
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	function select_change_handler() {
    		/*select_change_handler*/ ctx[5].call(select, /*item*/ ctx[6]);
    	}

    	const block = {
    		c: function create() {
    			input = element("input");
    			t0 = space();
    			select = element("select");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t1 = space();
    			textarea = element("textarea");
    			attr_dev(input, "class", "form-control");
    			add_location(input, file, 33, 2, 460);
    			attr_dev(select, "class", "form-control");
    			if (/*item*/ ctx[6].category === void 0) add_render_callback(select_change_handler);
    			add_location(select, file, 35, 2, 516);
    			attr_dev(textarea, "class", "form-control");
    			textarea.value = textarea_value_value = /*item*/ ctx[6].body;
    			add_location(textarea, file, 41, 2, 680);

    			dispose = [
    				listen_dev(input, "input", input_input_handler),
    				listen_dev(select, "change", select_change_handler)
    			];
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*item*/ ctx[6].title);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, select, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(select, null);
    			}

    			select_option(select, /*item*/ ctx[6].category);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, textarea, anchor);
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*data*/ 1 && input.value !== /*item*/ ctx[6].title) {
    				set_input_value(input, /*item*/ ctx[6].title);
    			}

    			if (dirty & /*data*/ 1) {
    				each_value_1 = /*data*/ ctx[0].categories;
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(select, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}

    			if (dirty & /*data*/ 1) {
    				select_option(select, /*item*/ ctx[6].category);
    			}

    			if (dirty & /*data*/ 1 && textarea_value_value !== (textarea_value_value = /*item*/ ctx[6].body)) {
    				prop_dev(textarea, "value", textarea_value_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(select);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(textarea);
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(33:2) {#if current==item.id}",
    		ctx
    	});

    	return block;
    }

    // (37:2) {#each data.categories as cat}
    function create_each_block_1(ctx) {
    	let option;
    	let t_value = /*cat*/ ctx[9].name + "";
    	let t;
    	let option_value_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = option_value_value = /*cat*/ ctx[9].slug;
    			option.value = option.__value;
    			add_location(option, file, 37, 2, 608);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*data*/ 1 && t_value !== (t_value = /*cat*/ ctx[9].name + "")) set_data_dev(t, t_value);

    			if (dirty & /*data*/ 1 && option_value_value !== (option_value_value = /*cat*/ ctx[9].slug)) {
    				prop_dev(option, "__value", option_value_value);
    			}

    			option.value = option.__value;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(37:2) {#each data.categories as cat}",
    		ctx
    	});

    	return block;
    }

    // (32:0) {#each data.entries as item }
    function create_each_block(ctx) {
    	let if_block_anchor;
    	let if_block = /*current*/ ctx[1] == /*item*/ ctx[6].id && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (/*current*/ ctx[1] == /*item*/ ctx[6].id) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(32:0) {#each data.entries as item }",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let div0;
    	let t;
    	let div1;
    	let each_value_2 = /*data*/ ctx[0].entries;
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks_1[i] = create_each_block_2(get_each_context_2(ctx, each_value_2, i));
    	}

    	let each_value = /*data*/ ctx[0].entries;
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div0 = element("div");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t = space();
    			div1 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div0, "class", "col-md-4");
    			attr_dev(div0, "id", "posts");
    			add_location(div0, file, 20, 0, 117);
    			attr_dev(div1, "class", "col-md-6");
    			attr_dev(div1, "id", "main");
    			add_location(div1, file, 28, 0, 368);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(div0, null);
    			}

    			insert_dev(target, t, anchor);
    			insert_dev(target, div1, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div1, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*data, current, setEntry*/ 7) {
    				each_value_2 = /*data*/ ctx[0].entries;
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2(ctx, each_value_2, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_2(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(div0, null);
    					}
    				}

    				for (; i < each_blocks_1.length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_2.length;
    			}

    			if (dirty & /*current, data*/ 3) {
    				each_value = /*data*/ ctx[0].entries;
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div1, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			destroy_each(each_blocks_1, detaching);
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(div1);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { data } = $$props;
    	let { current } = $$props;

    	function setEntry(item) {
    		$$invalidate(1, current = item.id);
    	}

    	const writable_props = ["data", "current"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Posts> was created with unknown prop '${key}'`);
    	});

    	const click_handler = item => $$invalidate(1, current = item.id);

    	function input_input_handler(item) {
    		item.title = this.value;
    		$$invalidate(0, data);
    	}

    	function select_change_handler(item) {
    		item.category = select_value(this);
    		$$invalidate(0, data);
    	}

    	$$self.$set = $$props => {
    		if ("data" in $$props) $$invalidate(0, data = $$props.data);
    		if ("current" in $$props) $$invalidate(1, current = $$props.current);
    	};

    	$$self.$capture_state = () => {
    		return { data, current };
    	};

    	$$self.$inject_state = $$props => {
    		if ("data" in $$props) $$invalidate(0, data = $$props.data);
    		if ("current" in $$props) $$invalidate(1, current = $$props.current);
    	};

    	return [
    		data,
    		current,
    		setEntry,
    		click_handler,
    		input_input_handler,
    		select_change_handler
    	];
    }

    class Posts extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, { data: 0, current: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Posts",
    			options,
    			id: create_fragment.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || ({});

    		if (/*data*/ ctx[0] === undefined && !("data" in props)) {
    			console.warn("<Posts> was created without expected prop 'data'");
    		}

    		if (/*current*/ ctx[1] === undefined && !("current" in props)) {
    			console.warn("<Posts> was created without expected prop 'current'");
    		}
    	}

    	get data() {
    		throw new Error("<Posts>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set data(value) {
    		throw new Error("<Posts>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get current() {
    		throw new Error("<Posts>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set current(value) {
    		throw new Error("<Posts>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/AddPost.svelte generated by Svelte v3.16.7 */

    const file$1 = "src/components/AddPost.svelte";

    function create_fragment$1(ctx) {
    	let button;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Add Post";
    			attr_dev(button, "class", "btn btn-outline-light w-100");
    			add_location(button, file$1, 27, 0, 649);
    			dispose = listen_dev(button, "click", /*addEntry*/ ctx[0], false, false, false);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function makeid(length) {
    	var result = "";
    	var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    	var charactersLength = characters.length;

    	for (var i = 0; i < length; i++) {
    		result += characters.charAt(Math.floor(Math.random() * charactersLength));
    	}

    	return result;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { data } = $$props;
    	let { current } = $$props;

    	function addEntry() {
    		let newitem = {
    			id: makeid(6),
    			title: "Untitled",
    			body: ""
    		};

    		data.entries.unshift(newitem);
    		$$invalidate(1, data);
    		$$invalidate(2, current = data.entries[0].id);
    	}

    	const writable_props = ["data", "current"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<AddPost> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ("data" in $$props) $$invalidate(1, data = $$props.data);
    		if ("current" in $$props) $$invalidate(2, current = $$props.current);
    	};

    	$$self.$capture_state = () => {
    		return { data, current };
    	};

    	$$self.$inject_state = $$props => {
    		if ("data" in $$props) $$invalidate(1, data = $$props.data);
    		if ("current" in $$props) $$invalidate(2, current = $$props.current);
    	};

    	return [addEntry, data, current];
    }

    class AddPost extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { data: 1, current: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "AddPost",
    			options,
    			id: create_fragment$1.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || ({});

    		if (/*data*/ ctx[1] === undefined && !("data" in props)) {
    			console.warn("<AddPost> was created without expected prop 'data'");
    		}

    		if (/*current*/ ctx[2] === undefined && !("current" in props)) {
    			console.warn("<AddPost> was created without expected prop 'current'");
    		}
    	}

    	get data() {
    		throw new Error("<AddPost>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set data(value) {
    		throw new Error("<AddPost>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get current() {
    		throw new Error("<AddPost>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set current(value) {
    		throw new Error("<AddPost>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/Categories.svelte generated by Svelte v3.16.7 */

    const file$2 = "src/components/Categories.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[4] = list[i];
    	return child_ctx;
    }

    // (65:0) {#each data.categories as cat}
    function create_each_block$1(ctx) {
    	let div;
    	let t_value = /*cat*/ ctx[4].name + "";
    	let t;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(t_value);
    			attr_dev(div, "class", "cat");
    			attr_dev(div, "href", "#");
    			add_location(div, file$2, 65, 0, 1574);

    			dispose = listen_dev(
    				div,
    				"click",
    				function () {
    					if (is_function(setCategory(/*cat*/ ctx[4].slug))) setCategory(/*cat*/ ctx[4].slug).apply(this, arguments);
    				},
    				false,
    				false,
    				false
    			);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*data*/ 1 && t_value !== (t_value = /*cat*/ ctx[4].name + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(65:0) {#each data.categories as cat}",
    		ctx
    	});

    	return block;
    }

    // (71:0) {#if !addcat}
    function create_if_block_1(ctx) {
    	let i;
    	let t;

    	const block = {
    		c: function create() {
    			i = element("i");
    			t = text("  add category");
    			attr_dev(i, "class", "fas fa-plus");
    			add_location(i, file$2, 71, 0, 1718);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, i, anchor);
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(i);
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(71:0) {#if !addcat}",
    		ctx
    	});

    	return block;
    }

    // (75:0) {#if addcat}
    function create_if_block$1(ctx) {
    	let div1;
    	let input;
    	let t0;
    	let div0;
    	let button;
    	let dispose;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			input = element("input");
    			t0 = space();
    			div0 = element("div");
    			button = element("button");
    			button.textContent = "Add";
    			attr_dev(input, "type", "text");
    			attr_dev(input, "class", "form-control");
    			attr_dev(input, "placeholder", "Category");
    			attr_dev(input, "id", "add-category");
    			add_location(input, file$2, 76, 2, 1818);
    			attr_dev(button, "class", "btn btn-outline-light");
    			attr_dev(button, "type", "button");
    			attr_dev(button, "id", "button-addon");
    			add_location(button, file$2, 78, 4, 1939);
    			attr_dev(div0, "class", "input-group-append");
    			add_location(div0, file$2, 77, 2, 1902);
    			attr_dev(div1, "class", "input-group mb-3");
    			add_location(div1, file$2, 75, 0, 1785);
    			dispose = listen_dev(button, "click", /*addCategory*/ ctx[3], false, false, false);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, input);
    			append_dev(div1, t0);
    			append_dev(div1, div0);
    			append_dev(div0, button);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(75:0) {#if addcat}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let div2;
    	let div0;
    	let t1;
    	let t2;
    	let div1;
    	let t3;
    	let dispose;
    	let each_value = /*data*/ ctx[0].categories;
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	let if_block0 = !/*addcat*/ ctx[1] && create_if_block_1(ctx);
    	let if_block1 = /*addcat*/ ctx[1] && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			div0.textContent = "All";
    			t1 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t2 = space();
    			div1 = element("div");
    			if (if_block0) if_block0.c();
    			t3 = space();
    			if (if_block1) if_block1.c();
    			attr_dev(div0, "class", "cat");
    			attr_dev(div0, "onclick", "showAllEntries();");
    			add_location(div0, file$2, 62, 0, 1487);
    			attr_dev(div1, "class", "add-cat");
    			add_location(div1, file$2, 69, 0, 1660);
    			attr_dev(div2, "class", "categories");
    			add_location(div2, file$2, 61, 0, 1462);
    			dispose = listen_dev(div1, "click", /*showAddCat*/ ctx[2], false, false, false);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			append_dev(div2, t1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div2, null);
    			}

    			append_dev(div2, t2);
    			append_dev(div2, div1);
    			if (if_block0) if_block0.m(div1, null);
    			append_dev(div1, t3);
    			if (if_block1) if_block1.m(div1, null);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*setCategory, data*/ 1) {
    				each_value = /*data*/ ctx[0].categories;
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div2, t2);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (!/*addcat*/ ctx[1]) {
    				if (!if_block0) {
    					if_block0 = create_if_block_1(ctx);
    					if_block0.c();
    					if_block0.m(div1, t3);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*addcat*/ ctx[1]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block$1(ctx);
    					if_block1.c();
    					if_block1.m(div1, null);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			destroy_each(each_blocks, detaching);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function setCategory(mycat) {
    	document.querySelectorAll(".item").forEach(function (el) {
    		el.style.display = "none";
    	});

    	document.querySelectorAll("[data-category=" + mycat + "]").forEach(function (el) {
    		el.style.display = "block";
    	});
    }

    function slugify(string) {
    	const a = "àáâäæãåāăąçćčđďèéêëēėęěğǵḧîïíīįìłḿñńǹňôöòóœøōõőṕŕřßśšşșťțûüùúūǘůűųẃẍÿýžźż·/_,:;";
    	const b = "aaaaaaaaaacccddeeeeeeeegghiiiiiilmnnnnoooooooooprrsssssttuuuuuuuuuwxyyzzz------";
    	const p = new RegExp(a.split("").join("|"), "g");
    	return string.toString().toLowerCase().replace(/\s+/g, "-").replace(p, c => b.charAt(a.indexOf(c))).replace(/&/g, "-and-").replace(/[^\w\-]+/g, "").replace(/\-\-+/g, "-").replace(/^-+/, "").replace(/-+$/, "");
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { data } = $$props;
    	let addcat = false;

    	function showAddCat() {
    		$$invalidate(1, addcat = true);
    	}

    	function addCategory() {
    		let category = document.getElementById("add-category").value;

    		if (category.length > 4) {
    			let newitem = { name: category, slug: slugify(category) };
    			data.categories.push(newitem);
    			$$invalidate(0, data);
    		} else {
    			alert("Category name should be at least 5 characters long");
    		}

    		$$invalidate(1, addcat = false);
    	}

    	const writable_props = ["data"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Categories> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ("data" in $$props) $$invalidate(0, data = $$props.data);
    	};

    	$$self.$capture_state = () => {
    		return { data, addcat };
    	};

    	$$self.$inject_state = $$props => {
    		if ("data" in $$props) $$invalidate(0, data = $$props.data);
    		if ("addcat" in $$props) $$invalidate(1, addcat = $$props.addcat);
    	};

    	return [data, addcat, showAddCat, addCategory];
    }

    class Categories extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { data: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Categories",
    			options,
    			id: create_fragment$2.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || ({});

    		if (/*data*/ ctx[0] === undefined && !("data" in props)) {
    			console.warn("<Categories> was created without expected prop 'data'");
    		}
    	}

    	get data() {
    		throw new Error("<Categories>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set data(value) {
    		throw new Error("<Categories>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/App.svelte generated by Svelte v3.16.7 */
    const file$3 = "src/App.svelte";

    function create_fragment$3(ctx) {
    	let main;
    	let div1;
    	let div0;
    	let updating_data;
    	let updating_current;
    	let t0;
    	let updating_data_1;
    	let t1;
    	let updating_data_2;
    	let updating_current_1;
    	let current;

    	function addpost_data_binding(value) {
    		/*addpost_data_binding*/ ctx[2].call(null, value);
    	}

    	function addpost_current_binding(value_1) {
    		/*addpost_current_binding*/ ctx[3].call(null, value_1);
    	}

    	let addpost_props = {};

    	if (/*data*/ ctx[0] !== void 0) {
    		addpost_props.data = /*data*/ ctx[0];
    	}

    	if (/*current*/ ctx[1] !== void 0) {
    		addpost_props.current = /*current*/ ctx[1];
    	}

    	const addpost = new AddPost({ props: addpost_props, $$inline: true });
    	binding_callbacks.push(() => bind(addpost, "data", addpost_data_binding));
    	binding_callbacks.push(() => bind(addpost, "current", addpost_current_binding));

    	function categories_data_binding(value_2) {
    		/*categories_data_binding*/ ctx[4].call(null, value_2);
    	}

    	let categories_props = {};

    	if (/*data*/ ctx[0] !== void 0) {
    		categories_props.data = /*data*/ ctx[0];
    	}

    	const categories = new Categories({ props: categories_props, $$inline: true });
    	binding_callbacks.push(() => bind(categories, "data", categories_data_binding));

    	function posts_data_binding(value_3) {
    		/*posts_data_binding*/ ctx[5].call(null, value_3);
    	}

    	function posts_current_binding(value_4) {
    		/*posts_current_binding*/ ctx[6].call(null, value_4);
    	}

    	let posts_props = {};

    	if (/*data*/ ctx[0] !== void 0) {
    		posts_props.data = /*data*/ ctx[0];
    	}

    	if (/*current*/ ctx[1] !== void 0) {
    		posts_props.current = /*current*/ ctx[1];
    	}

    	const posts = new Posts({ props: posts_props, $$inline: true });
    	binding_callbacks.push(() => bind(posts, "data", posts_data_binding));
    	binding_callbacks.push(() => bind(posts, "current", posts_current_binding));

    	const block = {
    		c: function create() {
    			main = element("main");
    			div1 = element("div");
    			div0 = element("div");
    			create_component(addpost.$$.fragment);
    			t0 = space();
    			create_component(categories.$$.fragment);
    			t1 = space();
    			create_component(posts.$$.fragment);
    			attr_dev(div0, "class", "col-md-2");
    			attr_dev(div0, "id", "side");
    			add_location(div0, file$3, 44, 0, 909);
    			attr_dev(div1, "class", "row no-gutters");
    			add_location(div1, file$3, 43, 0, 880);
    			add_location(main, file$3, 41, 0, 872);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div1);
    			append_dev(div1, div0);
    			mount_component(addpost, div0, null);
    			append_dev(div0, t0);
    			mount_component(categories, div0, null);
    			append_dev(div1, t1);
    			mount_component(posts, div1, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const addpost_changes = {};

    			if (!updating_data && dirty & /*data*/ 1) {
    				updating_data = true;
    				addpost_changes.data = /*data*/ ctx[0];
    				add_flush_callback(() => updating_data = false);
    			}

    			if (!updating_current && dirty & /*current*/ 2) {
    				updating_current = true;
    				addpost_changes.current = /*current*/ ctx[1];
    				add_flush_callback(() => updating_current = false);
    			}

    			addpost.$set(addpost_changes);
    			const categories_changes = {};

    			if (!updating_data_1 && dirty & /*data*/ 1) {
    				updating_data_1 = true;
    				categories_changes.data = /*data*/ ctx[0];
    				add_flush_callback(() => updating_data_1 = false);
    			}

    			categories.$set(categories_changes);
    			const posts_changes = {};

    			if (!updating_data_2 && dirty & /*data*/ 1) {
    				updating_data_2 = true;
    				posts_changes.data = /*data*/ ctx[0];
    				add_flush_callback(() => updating_data_2 = false);
    			}

    			if (!updating_current_1 && dirty & /*current*/ 2) {
    				updating_current_1 = true;
    				posts_changes.current = /*current*/ ctx[1];
    				add_flush_callback(() => updating_current_1 = false);
    			}

    			posts.$set(posts_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(addpost.$$.fragment, local);
    			transition_in(categories.$$.fragment, local);
    			transition_in(posts.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(addpost.$$.fragment, local);
    			transition_out(categories.$$.fragment, local);
    			transition_out(posts.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(addpost);
    			destroy_component(categories);
    			destroy_component(posts);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let data = {};

    	data.entries = [
    		{
    			id: "3KvB5k89",
    			title: "Hello there",
    			body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    			category: "default"
    		},
    		{
    			id: "4Kf79Op",
    			title: "Second article",
    			body: "Sed a consectetur urna. Nulla sollicitudin pulvinar leo nec ultricies.",
    			category: "default"
    		},
    		{
    			id: "5gHRc9i",
    			title: "Third article",
    			body: "Vestibulum diam massa, fermentum vel suscipit eget, rhoncus vitae metus.",
    			category: "ideas"
    		}
    	];

    	data.categories = [{ name: "default", slug: "default" }, { name: "ideas", slug: "ideas" }];
    	let current = data.entries[0].id;

    	function addpost_data_binding(value) {
    		data = value;
    		$$invalidate(0, data);
    	}

    	function addpost_current_binding(value_1) {
    		current = value_1;
    		$$invalidate(1, current);
    	}

    	function categories_data_binding(value_2) {
    		data = value_2;
    		$$invalidate(0, data);
    	}

    	function posts_data_binding(value_3) {
    		data = value_3;
    		$$invalidate(0, data);
    	}

    	function posts_current_binding(value_4) {
    		current = value_4;
    		$$invalidate(1, current);
    	}

    	$$self.$capture_state = () => {
    		return {};
    	};

    	$$self.$inject_state = $$props => {
    		if ("data" in $$props) $$invalidate(0, data = $$props.data);
    		if ("current" in $$props) $$invalidate(1, current = $$props.current);
    	};

    	return [
    		data,
    		current,
    		addpost_data_binding,
    		addpost_current_binding,
    		categories_data_binding,
    		posts_data_binding,
    		posts_current_binding
    	];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    	props: {
    		name: 'world'
    	}
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
