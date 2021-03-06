import styled from 'styled-components';
import Link from 'next/link';
import { siteTitle } from '../../config';

const SiteFooter = styled.footer`
    font-size: 0.8rem;
    padding: 20px;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;

    .copyright {
        grid-column-start: 2;
        grid-column-end: 2;
    }

    ul {
        grid-column-start: 3;
        grid-column-end: 3;
        text-align: right;
        margin: 0;

        li {
            list-style-type: none;
            display: inline;
            padding: 0 12px;
        }
    }

    @media all and (max-width: 767px) {
        grid-template-columns: 1fr 1fr;

        .copyright {
            grid-column-start: 1;
            grid-column-end: 1;
        }

        ul {
            grid-column-start: 2;
            grid-column-end: 2;
        }
    }
`;

const Footer = () => {
    return (
        <SiteFooter>
            <div className="copyright">
                <em>&copy; {siteTitle}</em>
            </div>
            <ul>
                <li>
                    <Link href="/">
                        <a>Home</a>
                    </Link>
                </li>
                <li>
                    <Link href="/about">
                        <a>About</a>
                    </Link>
                </li>
                <li>
                    <a href="https://github.com/kpwags/digitalfamilycookbook">GitHub</a>
                </li>
            </ul>
        </SiteFooter>
    );
};

export { Footer };
