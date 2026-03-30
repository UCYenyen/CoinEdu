import { CoinDetailResponse } from "@/features/coins/interfaces";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Github, Twitter } from "lucide-react";

interface CoinInfoProps {
  coin: CoinDetailResponse;
}

export function CoinInfo({ coin }: CoinInfoProps) {
  const links = coin.links;

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Info</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        {/* Websites */}
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-2">Websites</h3>
          <div className="flex flex-wrap gap-2">
            {links?.homepage?.[0] && (
              <a href={links.homepage[0]} target="_blank" rel="noreferrer">
                <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80 flex items-center gap-1 font-normal">
                  Website <ExternalLink className="w-3 h-3 ml-1" />
                </Badge>
              </a>
            )}
            {links?.whitepaper && (
              <a href={links.whitepaper} target="_blank" rel="noreferrer">
                <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80 flex items-center gap-1 font-normal">
                  Whitepaper <ExternalLink className="w-3 h-3 ml-1" />
                </Badge>
              </a>
            )}
          </div>
        </div>

        {/* Explorers */}
        {links?.blockchain_site && links.blockchain_site.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-2">Explorers</h3>
            <div className="flex flex-wrap gap-2">
              {links.blockchain_site.filter(url => url).slice(0, 3).map((url, i) => {
                try {
                  const domain = new URL(url).hostname.replace('www.', '');
                  return (
                    <a key={i} href={url} target="_blank" rel="noreferrer">
                      <Badge variant="outline" className="cursor-pointer hover:bg-secondary/50 flex items-center gap-1 font-normal">
                        {domain} <ExternalLink className="w-3 h-3 ml-1" />
                      </Badge>
                    </a>
                  );
                } catch { return null; }
              })}
            </div>
          </div>
        )}

        {/* Socials & Community */}
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-2">Community & Socials</h3>
          <div className="flex flex-wrap gap-2">
            {links?.twitter_screen_name && (
              <a href={`https://twitter.com/${links.twitter_screen_name}`} target="_blank" rel="noreferrer">
                 <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80 flex items-center gap-1 font-normal">
                  <Twitter className="w-3 h-3 mr-1" /> Twitter
                </Badge>
              </a>
            )}
            {links?.subreddit_url && (
              <a href={links.subreddit_url} target="_blank" rel="noreferrer">
                <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80 flex items-center gap-1 font-normal">
                  Reddit <ExternalLink className="w-3 h-3 ml-1" />
                </Badge>
              </a>
            )}
            {links?.repos_url?.github?.[0] && (
              <a href={links.repos_url.github[0]} target="_blank" rel="noreferrer">
                <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80 flex items-center gap-1 font-normal">
                  <Github className="w-3 h-3 mr-1" /> Github
                </Badge>
              </a>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
