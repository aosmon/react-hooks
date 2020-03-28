# Rule of hooks

At this point, we’ve seen how Hooks allow us to add state and side effects to our function components. However, there is one rule you have to follow when using Hooks and it has to do with where Hooks can be called.

Only call Hooks from the top-level of a function component or a custom Hook.

You can’t call them anywhere else. That means you can’t call them from a normal function, you can’t call them from a class component, and you can’t call them anywhere that’s not on the top level like inside of a loop, if statement, or event handler.

The reason for this rule is because React relies on the call order of Hooks to keep track of internal state and references. If your Hooks aren’t called consistently in the same order across renders, React can’t do that.
