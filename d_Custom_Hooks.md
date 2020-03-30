When you think about composition in React, odds are you think in terms of UI composition. This is natural since it’s what React is so good at.

view = fn(state)
Realistically, there’s more to building an app than just the UI layer. It’s not uncommon to need to compose and reuse non-visual logic. However, historically because React couples UI to a component, it’s never had a great answer for this.

To demonstrate this, let’s say we were in charge of recreating a dashboard similar to Stripe’s. As most projects go, everything goes great until the very end. Just when you think you’re about to be done, you notice that the dashboard has a bunch of different tooltips that need to appear when certain elements are hovered over.

Stripe Dashboard for teaching React Custom Hooks

There are a few ways to approach this. The one you decide to go with is to detect the hover state of the individual components and from that state, show or not show the tooltip. There are three components you need to add this hover detection functionality to - Info, TrendChart and DailyChart.

Let’s start with Info. Right now it’s just a simple SVG icon.

function Info ({ size }) {
  return (
    <svg viewBox="0 0 16 16" width={size}>
      <path d="M9 8a1 1 0 0 0-1-1H5.5a1 1 0 1 0 0 2H7v4a1 1 0 0 0 2 0zM4 0h8a4 4 0 0 1 4 4v8a4 4 0 0 1-4 4H4a4 4 0 0 1-4-4V4a4 4 0 0 1 4-4zm4 5.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" />
    </svg>
  )
}
Now we need to add functionality to it so it can detect whether it’s being hovered over or not. We can use the onMouseOver and onMouseOut mouse events that come with React. The function we pass to onMouseOver will be invoked when the component is hovered over and the function we pass to onMouseOut will be invoked when the component is no longer being hovered over. To do this the React way, we’ll add a hovering state value to our component using the useState Hook. This will trigger a re-render whenever hovering changes, showing or hiding our tooltip.

function Info ({ id, size }) {
  const [hovering, setHovering] = React.useState(false)

  const mouseOver = () => setHovering(true)
  const mouseOut = () => setHovering(false)

  return (
    <div className='container'>
      {hovering === true
        ? <Tooltip id={id} />
        : null}
      <svg
        onMouseOver={mouseOver}
        onMouseOut={mouseOut}
        width={size}
        viewBox="0 0 16 16">
        <path d="M9 8a1 1 0 0 0-1-1H5.5a1 1 0 1 0 0 2H7v4a1 1 0 0 0 2 0zM4 0h8a4 4 0 0 1 4 4v8a4 4 0 0 1-4 4H4a4 4 0 0 1-4-4V4a4 4 0 0 1 4-4zm4 5.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" />
      </svg>
    </div>
  )
}
Now we need to add the same functionality to our other two components, TrendChart and DailyChart. If it’s not broke, don’t fix it. Our hover logic for Info worked great so let’s use that same code again.

function TrendChart ({ id }) {
  const [hovering, setHovering] = React.useState(false)

  const mouseOver = () => setHovering(true)
  const mouseOut = () => setHovering(false)

  return (
      <React.Fragment>
        {hovering === true
          ? <Tooltip id={id}/>
          : null}
        <Chart
          type='trend'
          onMouseOver={mouseOver}
          onMouseOut={mouseOut}
        />
      </React.Fragment>
  )
}
You can probably guess the next step. We can do the same thing for our final DailyChart component.

function DailyChart ({ id }) {
  const [hovering, setHovering] = React.useState(false)

  const mouseOver = () => setHovering(true)
  const mouseOut = () => setHovering(false)

  return (
      <React.Fragment>
        {hovering === true
          ? <Tooltip id={props.id}/>
          : null}
        <Chart
          type='daily'
          onMouseOver={mouseOver}
          onMouseOut={mouseOut}
        />
      </React.Fragment>
  )
}
And with that, we’re all finished. The easiest way to reuse stateful logic in React is by copy/pasting 🤡.

You may have written React like this before. It’s not the end of the world (#shipit), but it’s not very “DRY”. As was obvious, we’re repeating the exact same hover logic in every one of our components.

At this point, the problem should be pretty clear, we want to avoid duplicating our hover logic anytime a new component needs it. So what’s the solution? Historically, we’ve had two (subpar) options, Higher-order components or Render Props.

Higher-order Components
With Higher-order components, you create a function that takes in a component as its argument. From that function, you return a new component that encapsulates all of the shared logic and renders the component that was passed in. From there, you can pass any data to the rendered component via props.

function withHover (Component) {
  return function (props) {
    const [hovering, setHovering] = React.useState(false)

    const mouseOver = () => setHovering(true)
    const mouseOut = () => setHovering(false)

    return (
      <div onMouseOver={mouseOver} onMouseOut={mouseOut}>
        <Component {...props} hovering={hovering} />
      </div>
    )
  }
}
Now, whenever we need a component to have data about its hovering state, we can pass that component as an argument to withHover. What we’ll get back is a new component that will be passed its hovering state as a prop called hovering.

const InfoWithHover = withHover(Info)
const TrendChartWithHover = withHover(TrendChart)
const DailyChartWithHover = withHover(DailyChart)
For a much deeper dive into Higher-order components, check out React Higher-Order Components

It’s not the prettiest solution, but it works. If sharing non-visual logic via Higher-Order components isn’t your cup of tea, we also have some Render Props.

Render Props
With Render Props, you take advantage of the fact that you can pass functions as props to React components. This means you can encapsulate shared logic in a component as you normally would. Then, to get the data out of that component, you pass it as an argument to the render prop.

function Hover ({ render }) {
  const [hovering, setHovering] = React.useState(false)

  const mouseOver = () => setHovering(true)
  const mouseOut = () => setHovering(false)

  return (
    <div onMouseOver={mouseOver} onMouseOut={mouseOut}>
      {render(hovering)}
    </div>
  )
}
Now with our Hover component, instead of each component having to duplicate the hovering logic, we can wrap each one inside of the render prop we pass to Hover and then pass down the hovering argument as a prop.

<Hover render={(hovering) => <Info hovering={hovering} />} />
<Hover render={(hovering) => <TrendChart hovering={hovering} />} />
<Hover render={(hovering) => <DailyChart hovering={hovering} />} />
For a much deeper dive into Render Props, check out React Render Props

Tradeoffs
Though they work, these patterns aren’t without their tradeoffs. First, if you’re not familiar with them (and even when you are), your brain can get a little wonky following the logic. Though necessary, it feels like the wrong abstraction. On top of that, both patterns force you to adjust your tree structure for the sake of reusability. At scale, this eventually leads to code that looks like this.

export default withHover(
  withTheme(
    withAuth(
      withRepos(Profile)
    )
  )
)
export default <Hover render={(hovering) => (
  <Theme render={(theme) => (
    <Auth render={(authed) => (
      <Repos render={(repos) => (
        <Profile 
          hovering={hovering}
          theme={theme}
          authed={authed}
          repos={repos}
        />
      )} />
    )} />
  )} />
)} />
The problem with both Higher-order components and Render Props is they’re a band-aid over a bigger problem - React couples UI to the component and has lacked a good primitive for sharing non-visual logic. As you can probably guess by now, Hooks have an answer for this. There’s no built-in Hook for sharing non-visual logic, instead, you can create your own custom Hooks that are decoupled from any UI.

Custom Hooks
To create a custom Hook, you simply create a function whose name starts with use. Like any other Hook, your custom Hook needs to follow the rules for Hooks. From there, because it’s just a function (and not a component), it’s not coupled to any UI and can return whatever it wants.

Now the question you’ve been waiting this whole post to answer, how would a custom Hook for sharing our hovering logic look compared to our Higher-Order Component and Render Prop solutions?

First, we create a function that starts with use.

function useHover () {}
Then we add the logic we want to share to it.

function useHover () {
  const [hovering, setHovering] = React.useState(false)

  const mouseOver = () => setHovering(true)
  const mouseOut = () => setHovering(false)
}
Then we decide what to return. In this case, we want the consumer of useHover to have two pieces of data, the hovering state and the attributes to add to the DOM node whose hovering state they want to track.

function useHover () {
  const [hovering, setHovering] = React.useState(false)

  const mouseOver = () => setHovering(true)
  const mouseOut = () => setHovering(false)

  const attrs = {
    onMouseOver: mouseOver,
    onMouseOut: mouseOut
  }
  return [hovering, attrs]
}
Now we can invoke useHover directly inside of any component which renders a DOM node whose hovering state we want to track.

function Info ({ id, size }) {
  const [hovering, attrs] = useHover()

  return (
      <React.Fragment>
        {hovering === true
          ? <Tooltip id={id} />
          : null}
        <svg
          {...attrs}
          width={size}
          viewBox="0 0 16 16" >
            <path d="M9 8a1 1 0 0 0-1-1H5.5a1 1 0 1 0 0 2H7v4a1 1 0 0 0 2 0zM4 0h8a4 4 0 0 1 4 4v8a4 4 0 0 1-4 4H4a4 4 0 0 1-4-4V4a4 4 0 0 1 4-4zm4 5.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" />
        </svg>
      </React.Fragment>
  )
}
There’s no convoluted logic flow you have to follow, you don’t have to create unnecessary wrapper components that modify your tree structure, and they compose with your app rather than against it.

To prove this even more, let’s look at how our code scales when we have to utilize multiple custom Hooks. As a reminder, I’ll also include the Higher-Order Component and Render Props solutions.

Higher-Order Component

export default withHover(
  withTheme(
    withAuth(
      withRepos(Profile)
    )
  )
)
Render Props

export default <Hover render={(hovering) => (
  <Theme render={(theme) => (
    <Auth render={(authed) => (
      <Repos render={(repos) => (
        <Profile 
          hovering={hovering}
          theme={theme}
          authed={authed}
          repos={repos}
        />
      )} />
    )} />
  )} />
)} />
Custom Hooks

function Profile () {
  const [hovering, attrs] = useHover()
  const theme = useTheme()
  const [authed, toLogin] = useAuth()
  const repos = useRepos()

  ...
}
Adding state and side effects to your function components is nice, but sharing non-visual logic via a custom Hook is THE thing that makes Hooks so special.
