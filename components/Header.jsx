import LogoIcon from '../assets/images/icons/Logo.svg'
import GitHubIcon from '../assets/images/icons/GitHub.svg'

function Header({ children }) {
    return (
        <div id='header'>
            <h1>
                <LogoIcon className='icon' />
                <strong>Car</strong>builder
            </h1>
            {children}
            <div className='actions'>
                <a target='_blank' href='https://github.com/amil3955/3D-Car-Builder' title='GitHub'>
                    <GitHubIcon className='icon' />
                </a>
            </div>
        </div>
    )
}

export default Header
