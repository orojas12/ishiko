import {
    Pagination as PaginationRoot,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
    PaginationEllipsis,
} from "@/components/ui/pagination";

export function Pagination({
    currentPage,
    totalPages,
    params,
}: {
    currentPage: number;
    totalPages: number;
    params: URLSearchParams;
}) {
    return (
        <PaginationRoot>
            <PaginationContent>
                <PreviousPageLink currentPage={currentPage} params={params} />
                <FirstPageLink currentPage={currentPage} params={params} />
                <PageLinks
                    siblings={2}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    params={params}
                />
                <LastPageLink
                    currentPage={currentPage}
                    totalPages={totalPages}
                    params={params}
                />
                <NextPageLink
                    currentPage={currentPage}
                    totalPages={totalPages}
                    params={params}
                />
            </PaginationContent>
        </PaginationRoot>
    );
}

function PreviousPageLink(props: {
    currentPage: number;
    params: URLSearchParams;
}) {
    const paramsWithPage = new URLSearchParams(props.params);
    paramsWithPage.set("page", (props.currentPage - 1).toString());
    return props.currentPage > 1 ? (
        <PaginationItem>
            <PaginationPrevious href={`?${paramsWithPage.toString()}`} />
        </PaginationItem>
    ) : (
        <PaginationItem>
            <PaginationPrevious href="" aria-disabled />
        </PaginationItem>
    );
}

function NextPageLink(props: {
    currentPage: number;
    totalPages: number;
    params: URLSearchParams;
}) {
    const paramsWithPage = new URLSearchParams(props.params);
    paramsWithPage.set("page", (props.currentPage + 1).toString());
    return props.currentPage < props.totalPages ? (
        <PaginationItem>
            <PaginationNext href={`?${paramsWithPage.toString()}`} />
        </PaginationItem>
    ) : (
        <PaginationItem>
            <PaginationNext href="" aria-disabled />
        </PaginationItem>
    );
}

function FirstPageLink(props: {
    currentPage: number;
    params: URLSearchParams;
}) {
    const paramsWithPage = new URLSearchParams(props.params);
    paramsWithPage.set("page", "1");
    return props.currentPage > 1 ? (
        <PaginationItem>
            <PaginationLink href={`?${paramsWithPage.toString()}`}>
                1
            </PaginationLink>
        </PaginationItem>
    ) : (
        <PaginationItem>
            <PaginationLink href="" aria-disabled>
                1
            </PaginationLink>
        </PaginationItem>
    );
}

function LastPageLink(props: {
    currentPage: number;
    totalPages: number;
    params: URLSearchParams;
}) {
    const paramsWithPage = new URLSearchParams(props.params);
    paramsWithPage.set("page", props.totalPages.toString());
    return props.currentPage < props.totalPages ? (
        <PaginationItem>
            <PaginationLink href={`?${paramsWithPage.toString()}`}>
                {props.totalPages}
            </PaginationLink>
        </PaginationItem>
    ) : (
        <PaginationItem>
            <PaginationLink href="" aria-disabled>
                {props.totalPages}
            </PaginationLink>
        </PaginationItem>
    );
}

function PageLinks(props: {
    params: URLSearchParams;
    currentPage: number;
    totalPages: number;
    siblings: number;
}) {
    const { totalPages, currentPage, siblings } = props;
    const links = [];
    const start = 1;
    const end = totalPages;
    const hasLeftEllipsis = currentPage - start > siblings + 2;
    const hasRightEllipsis = end - currentPage > siblings + 2;

    const ellipsis = (
        <PaginationItem>
            <PaginationEllipsis />
        </PaginationItem>
    );

    const getPageLink = (i: number) => {
        const paramsWithPage = new URLSearchParams(props.params);
        paramsWithPage.set("page", i.toString());
        return (
            <PaginationItem>
                <PaginationLink href={`?${paramsWithPage.toString()}`}>
                    {i}
                </PaginationLink>
            </PaginationItem>
        );
    };

    if (hasLeftEllipsis && hasRightEllipsis) {
        for (let i = currentPage - siblings; i <= currentPage + siblings; i++) {
            links.push(getPageLink(i));
        }
    } else if (hasLeftEllipsis) {
        for (let i = siblings * 2 + 2; i > 0; i--) {
            links.push(getPageLink(end - i));
        }
    } else if (hasRightEllipsis) {
        for (let i = start; i <= siblings * 2 + 2; i++) {
            links.push(getPageLink(i + 1));
        }
    } else {
        for (let i = start; i < end - 1; i++) {
            links.push(getPageLink(i + 1));
        }
    }

    if (hasLeftEllipsis) {
        links.unshift(ellipsis);
    }

    if (hasRightEllipsis) {
        links.push(ellipsis);
    }

    return links;
}
